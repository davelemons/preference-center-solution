const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const https = require("https");
const url = require('url');

function putMetadata(tableName, projectID) {
  return new Promise((resolve, reject) => {

    console.log("putMetadata");

    var params = {
      TableName: tableName,
      Item:{
        "projectID": projectID,
        "websiteURL": "http://aws.amazon.com",
        "unsubscribe": {
          "surveyQuestions": ["I no longer want to receive these emails", "I never signed up for this mailing list", "The emails are inappropriate", "The emails are spam and should be reported", "Other (fill in reason below)"],
          "enabled": true,
          "surveyEnabled": true
        },
        "categories": [{
          "name": "Newsletters",
          "description": "Check out our way cool newsletters!",
          "publications": [{
            "name": "Runners Monthly",
            "description": "<strong>Do you love running?</strong>  If so, you need to subscribe to this great newsletter with all things Running",
            "id": "runnersMonthly"
          }, {
            "name": "The Shoe Collector",
            "description": "Celebrate all things related to the collecting and storing shoes",
            "id": "theShoeCollector"
          }]
        }, {
          "name": "Specials & New Arrivals",
          "description": "Sign up for the best deals and upcoming new seasonal seasonal discounts",
          "publications": [{
            "name": "Weekly Specials",
            "description": "Be one of the first to know about our weekly specials and special discounts",
            "id": "weeklySpecials"
          }, {
            "name": "New Arrivals",
            "description": "Our inventory changes according to whats available each season.  Sign up to stay informed of all the new arrivals",
            "id": "newArrivals"
          }]
        }],
        "logoURL": "img/badge.jpg",
        "attributes": [{
          "inputLabel": "First Name",
          "description": "Please enter your First Name",
          "inputType": "text",
          "id": "firstName",
          "required": true,
          "inputPlaceholder": "Jane"
        }, {
          "inputLabel": "Last Name",
          "description": "Please enter your Last Name",
          "inputType": "text",
          "id": "lastName",
          "required": true,
          "inputPlaceholder": "Doe"
        }, {
          "inputLabel": "Communication Preference",
          "options": [{
            "value": "EMAIL",
            "selected": false,
            "label": "Email"
          }, {
            "value": "SMS",
            "selected": false,
            "label": "SMS"
          }],
          "description": "How would you like for us to contact you?",
          "inputType": "radio",
          "id": "preferredChannel",
          "required": false
        }, {
          "inputLabel": "Where do you Shop?",
          "options": [{
            "value": "",
            "selected": true,
            "label": ""
          }, {
            "value": "ao",
            "selected": false,
            "label": "Always online"
          }, {
            "value": "airs",
            "selected": false,
            "label": "Always in regular shops"
          }, {
            "value": "aoirsap",
            "selected": false,
            "label": "As often in regular shops as possible"
          }, {
            "value": "uooirs",
            "selected": false,
            "label": "Usually online, occasionally in regular shops"
          }, {
            "value": "uirsoo",
            "selected": false,
            "label": "Usually in regular shops, occasionally online"
          }],
          "description": "",
          "inputType": "select",
          "id": "shoppingPreference",
          "required": false
        }, {
          "inputLabel": "Favorite Activities",
          "options": [{
            "value": "Hiking",
            "selected": false,
            "label": "Hiking"
          }, {
            "value": "Running",
            "selected": false,
            "label": "Running"
          }, {
            "value": "Walking",
            "selected": false,
            "label": "Walking"
          }, {
            "value": "Cycling",
            "selected": false,
            "label": "Cycling"
          }],
          "description": "What is your favorite outdoor activity?",
          "inputType": "checkbox",
          "id": "favoriteActivity",
          "required": false
        }],
        "text": {
          "inputValidationMessages": {
            "number": "You can enter only numbers in this field.",
            "maxChecked": "Maximum {count} options allowed. ",
            "minLength": "Minimum {count} characters allowed.",
            "maxSelected": "Maximum {count} selection allowed.",
            "notEqual": "Fields do not match.",
            "minChecked": "Please select minimum {count} options.",
            "minSelected": "Minimum {count} selection allowed.",
            "different": "Fields cannot be the same as each other.",
            "creditCard": "Invalid credit card number.",
            "required": "This field is required.",
            "email": "Your E-mail address appears to be invalid.",
            "maxLength": "Maximum {count} characters allowed."
          },
          "errorText": "We apologize, but there was an error saving your information.",
          "pageTitle": "Communication Preferences",
          "unsubscribeText": "Please Remove me from all Publications",
          "successText": "Thank you for submitting your information!",
          "pageDescription": "Please indicate which newsletters and special offers you would like to receive below",
          "submitButtonText": "Submit",
          "pageHeader": ""
        },
        "availableChannels": [{
          "displayName": "Email",
          "inputLabel": "Email Address",
          "description": "This is a tooltip for Email!",
          "inputType": "email",
          "id": "EMAIL",
          "inputMask": "'alias': 'email'",
          "required": true,
          "inputPlaceholder": ""
        }, {
          "displayName": "SMS",
          "inputLabel": "Mobile Phone Number",
          "description": "This is a tooltip for SMS!",
          "inputType": "tel",
          "id": "SMS",
          "inputMask": "'mask': '+1(999) 999-9999'",
          "required": false,
          "inputPlaceholder": "(206) 555-0199"
        }],
        "description": "Preference center for Accent Athletics",
        "preferenceCenterID": "default"
      }
    };

    dynamo.put(params, function(err, data) { 
      if (err) {
        console.log("putMetadata Error:");
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
  return new Promise((resolve, reject) => {
    console.log("getAPIKey");
    var apigateway = new AWS.APIGateway();
    var params = {
      apiKey: apiKeyID,
      includeValue: true
    };

    apigateway.getApiKey(params, function(err, ApiKeyData) {
      if (err) {
        console.log("getAPIKey Error:");
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

exports.handler =  (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try{
      putMetadata(event.ResourceProperties.DynamoTableName, event.ResourceProperties.PinpointProjectID)
      .then(function(){
        return getAPIKey(event.ResourceProperties.ApiKeyID);
      })
      .then(function(apiKey){
        return sendResponse(event, context.logStreamName, 'SUCCESS', {'apiKey':apiKey});
      })
      .catch(function(err){
        console.log(JSON.stringify(err));
        return sendResponse(event, context.logStreamName, 'FAILED', {});
      });
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
