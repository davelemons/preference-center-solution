const shortid = require('shortid');
const JSZip = require("jszip");
const url = require('url');
const https = require('https');
const fs = require('fs');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({'region':'us-east-1'}); //Need edge functions to goto us-east-1

function buildEdgeFunction(roleARN, edgeFunctionName){
  return new Promise(function(resolve,reject){
    try{
      console.log("lambda_create_function");
        
      var zip = new JSZip();
      var lambdaCode = `'use strict';

exports.handler = async (event, context, callback) => {
const response = event.Records[0].cf.response;
const headers = response.headers;

headers['Strict-Transport-Security'] = [{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload',
}];

headers['X-XSS-Protection'] = [{
  key: 'X-XSS-Protection',
  value: '1; mode=block',
}];

headers['X-Content-Type-Options'] = [{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
}];

// headers['X-Frame-Options'] = [{
//     key: 'X-Frame-Options',
//     value: 'SAMEORIGIN',
// }];

headers['Referrer-Policy'] = [{ key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' }];

headers['Content-Security-Policy'] = [{
  key: 'Content-Security-Policy',
  value: 'upgrade-insecure-requests;',
}];

callback(null, response);
};`;

      zip.file("index.js", lambdaCode);

      zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
      .pipe(fs.createWriteStream('/tmp/function.zip'))
      .on('finish', function () {
          // JSZip generates a readable stream with a "end" event,
          // but is piped here in a writable stream which emits a "finish" event.
          console.log("function.zip written.");

          var params = {
            Code: {
              ZipFile: fs.readFileSync('/tmp/function.zip')
            }, 
            Description: "Preference Center Lambda Edge Function", 
            FunctionName: edgeFunctionName, 
            Handler: "index.handler", 
            MemorySize: 128, 
            Publish: true, 
            Role: roleARN, 
            Runtime: "nodejs12.x", 
            Timeout: 5
          };

          lambda.createFunction(params, function(err, data) {
            if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
            } else {
              console.log(data); // successful response
              resolve(`${data.FunctionArn}:${data.Version}`);
            }   
          });

      });
    } catch (err){
      console.log(err);
      reject(err);
    }
  });
}

exports.handler =  async (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try{
    if (event.RequestType == 'Create'){

      let edgeFunctionVersionARN = await buildEdgeFunction(event.ResourceProperties.EdgeFunctionRoleARN, `${event.ResourceProperties.EdgeFunctionName}-${shortid.generate()}`);
      //let edgeFunctionVersionARN = await buildEdgeFunction(event.ResourceProperties.EdgeFunctionRoleARN, event.ResourceProperties.EdgeFunctionName);
      return sendResponse(event, context.logStreamName, 'SUCCESS', {'edgeFunctionVersionARN':edgeFunctionVersionARN});

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