const METADATA_TABLE = process.env.METADATA_TABLE

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const pinpoint = new AWS.Pinpoint({region: process.env.REGION});
const { v4: uuidv4 } = require('uuid');

/**
 * Helper Methods
 */
function getMetadata(projectID) {
    return new Promise((resolve, reject) => {

        var params = {
            TableName: METADATA_TABLE,
            Key: {
                projectID : projectID
            }
        };

        dynamo.get(params, function(err, metadata) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(metadata.Item);
            }
        });
    });
}

function getUser(projectID, userID) {
    return new Promise((resolve, reject) => {

        var params = {
            ApplicationId: projectID,
            UserId: userID
        };
        pinpoint.getUserEndpoints(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); 
            } else {
                resolve(data.EndpointsResponse.Item);
            }
        });
    });
}

function upsertEndpoint(projectID, endpointID, endpoint) {
  return new Promise((resolve, reject) => {

      var params = {
        ApplicationId: projectID,
        EndpointId: endpointID,
        EndpointRequest: endpoint
      };
      pinpoint.updateEndpoint(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); 
          } else {
              resolve(data);
          }
      });
  });
}

/**
 * TODO: Description
 */
exports.handler =  (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '500' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
    });

    try {
        switch (event.httpMethod) {
            case 'GET':
                if (event.pathParameters && event.pathParameters.projectID) {
                    if(event.pathParameters.userID){
                        //requesting an enpoint
                        getUser(event.pathParameters.projectID, event.pathParameters.userID)
                        .then(function(user) {
                            done(null, user);
                        }).catch(function(e) {
                            console.log(e);
                            done(e);
                        });
                    } else {
                        if (event.path.indexOf('/users/') > -1){
                            //no user specified, so must be opt-in.  Return empty endpoints array
                            done(null, []);
                        } else {
                            //requesting preference center metadata
                            getMetadata(event.pathParameters.projectID)
                            .then(function(metadata) {
                                done(null, metadata);
                            }).catch(function(e) {
                                console.log(e);
                                done(e);
                            });
                        }
                    }
                } else {
                    done({ "status": "error", "message": "Missing Required Parameters." });
                }
                break;
            case 'PUT':
                if (event.pathParameters && event.pathParameters.endpointID){
                  var endpoint = JSON.parse(event.body);
                  
                  //Remove unexpected parameters
                  delete endpoint.ApplicationId;
                  delete endpoint.CohortId;
                  delete endpoint.CreationDate;
                  delete endpoint.Id;
                  
                  console.log(endpoint);
                  
                  //Sanitize inputs
                  //TODO:
                    
                  upsertEndpoint(event.pathParameters.projectID, decodeURIComponent(event.pathParameters.endpointID),endpoint )
                  .then(function(endpoint) {
                      done(null, endpoint);
                  }).catch(function(e) {
                      console.log(e);
                      done(e);
                  });
                }
                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    } catch (err) {
        console.log(err);
        done({ "status": "error", "message": "Unhandled Error." });
    }
};
