const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const secretsmanager = new AWS.SecretsManager();
const url = require('url');
const https = require('https');
const fs = require('fs-extra');
const path = require('path');
const replace = require('replace-in-file');
const mime = require('mime-types');

function putMetadata(tableName, projectID) {
  return new Promise(function(resolve,reject){
    console.log("putMetadata");

    var params = require('./metadata-template.json');
    params.TableName = tableName;
    params.Item.projectID = projectID;

    console.log(params);

    dynamo.put(params, function(err, data) { 
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("putMetadata Success!");
        resolve(data);
      }
    });
  });
}

function getAPIKey(apiKeyID) {
  return new Promise(function(resolve,reject){
    console.log("getAPIKey");
    var apigateway = new AWS.APIGateway();
    var params = {
      apiKey: apiKeyID,
      includeValue: true
    };

    apigateway.getApiKey(params, function(err, ApiKeyData) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      } else {
        console.log("getAPIKey Success");
        console.log(ApiKeyData.value);      // successful response
        resolve(ApiKeyData.value);
      }
    });
  });
}

function getHashKey(secretARN) {
  return new Promise(function(resolve,reject){
    console.log("getHashKey");
    var params = {
      SecretId: secretARN
    };
    secretsmanager.getSecretValue(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      }
      else {
        resolve(JSON.parse(data.SecretString).hashkey);
      }
    });
  });
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function fileSubstitutions(event, tempDir) {
  return new Promise(function(resolve,reject){
    try{
      
      console.log(tempDir);
      
      //Copy files out of Layer
      fs.copySync('/opt', tempDir);

      //What files were moved
      walkDir(tempDir, function(filePath) {
        //const fileContents = fs.readFileSync(filePath, 'utf8');
        console.log(filePath);
      });
      
      //File Substitutions
      if (event.ResourceProperties.Substitutions) {
          
        //File Patterns
        var files = event.ResourceProperties.Substitutions.FilePattern.split(',');
        
        files.forEach(function(file,index) {
          files[index] = `${tempDir}/**/${file}`;
        });
        
        //Values to Replace
        var from = [];
        var to = [];

        Object.keys(event.ResourceProperties.Substitutions.Values).forEach(function(key) {
          var val = event.ResourceProperties.Substitutions.Values[key];
          from.push(new RegExp('\\${' + key + '}', 'g'));
          to.push(val);
        });
        
        var options = {
          files: files,
          from: from,
          to: to,
          countMatches: true,
        };
        
        console.log(options);
        
        //const results = await replace(options);

        replace(options)
        .then(function (results){
          console.log('Replacement results:', JSON.stringify(results));
          resolve(results);
        })
        .catch(function(err){
          console.log(err);
          reject(err);
        });
      } else {
        resolve();
      }
    } catch (err){
      console.log(err);
      reject(err);
    }
  });
}

exports.handler =  async (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try{
      if (event.RequestType == 'Create' || event.RequestType == 'Update'){

        var tempDir = `/tmp/${context.awsRequestId}`;

        let apiKey = await getAPIKey(event.ResourceProperties.ApiKeyID);
        let hashKey = await getHashKey(event.ResourceProperties.SecretARN);
        let metadataResults = await putMetadata(event.ResourceProperties.DynamoTableName, event.ResourceProperties.PinpointProjectID);

        //Inject apiKey
        event.ResourceProperties.Substitutions.Values.API_KEY = apiKey;

        let fileSubstitutionResults = await fileSubstitutions(event, tempDir, apiKey);

        //Upload to S3
        var filesToUpload = [];
        var bucketName = event.ResourceProperties.TargetBucket;
        walkDir(tempDir, function(filePath) {
          //TFilter out IgnoreFiles
          if(event.ResourceProperties.Substitutions.IgnoreFiles && event.ResourceProperties.Substitutions.IgnoreFiles.indexOf(path.basename(filePath)) == -1){
            var mimeType = mime.contentType(path.extname(filePath));
            filesToUpload.push({'path': filePath, 'mimeType': mimeType});
          }
        });
        
        for (const file of filesToUpload) {
          let bucketPath = file.path.replace(`${tempDir}/`,'');
          const params = {
            Bucket: bucketName,
            Key: bucketPath,
            ACL: event.ResourceProperties.Acl,
            ContentType: file.mimeType,
            Body: fs.readFileSync(file.path)
          };
          try {
            const stored = await s3.upload(params).promise();
            console.log(JSON.stringify(stored));
          } catch (err) {
            console.log(err);
          }
        }

        //Cleanup
        fs.removeSync(tempDir);


        return sendResponse(event, context.logStreamName, 'SUCCESS', {'apiKey':apiKey, 'hashKey':hashKey});
        // getAPIKey(event.ResourceProperties.ApiKeyID)
        // .then(function(apiKey){
        //   returnedAPIKey = apiKey
        //   event.ResourceProperties.Substitutions.Values.API_KEY = apiKey;
        //   return putMetadata(event.ResourceProperties.DynamoTableName, event.ResourceProperties.PinpointProjectID)
        // })
        // .then(function(){
        //   await processStaticFiles(event, context);
        // })
        // .then(function(){
        //   return sendResponse(event, context.logStreamName, 'SUCCESS', {'apiKey':returnedAPIKey});
        // })
        // .catch(function(err){
        //   console.log(JSON.stringify(err));
        //   return sendResponse(event, context.logStreamName, 'FAILED', {});
        // });
      } else {
        return sendResponse(event, context.logStreamName, 'SUCCESS', {});
      }
    }
    catch (ex){
      console.log(JSON.stringify(ex));
      return sendResponse(event, context.logStreamName, 'FAILED', {});
    }
};

/**
* Sends a response to the pre-signed S3 URL
*/
let sendResponse = function(event, logStreamName, responseStatus, responseData) {
  return new Promise((resolve, reject) => {
    try {
      const responseBody = JSON.stringify({
          Status: responseStatus,
          Reason: `See the details in CloudWatch Log Stream: ${logStreamName}`,
          PhysicalResourceId: logStreamName,
          StackId: event.StackId,
          RequestId: event.RequestId,
          LogicalResourceId: event.LogicalResourceId,
          Data: responseData,
      });

      console.log('RESPONSE BODY:\n', responseBody);
      const parsedUrl = url.parse(event.ResponseURL);
      const options = {
          hostname: parsedUrl.hostname,
          port: 443,
          path: parsedUrl.path,
          method: 'PUT',
          headers: {
              'Content-Type': '',
              'Content-Length': responseBody.length,
          }
      };

      const req = https.request(options, (res) => {
          console.log('STATUS:', res.statusCode);
          console.log('HEADERS:', JSON.stringify(res.headers));
          resolve('Successfully sent stack response!');
      });

      req.on('error', (err) => {
          console.log('sendResponse Error:\n', err);
          reject(err);
      });

      req.write(responseBody);
      req.end();

    } catch(err) {
      console.log('GOT ERROR');
      console.log(err);
      reject(err);
    }
  });
};
