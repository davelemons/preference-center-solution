const METADATA_TABLE = process.env.METADATA_TABLE;
const CORS_DOMAIN = process.env.CORS_DOMAIN;
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const pinpoint = new AWS.Pinpoint({region: process.env.REGION});
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')

var xss = require("xss");
const xssOptions = {}; // Specifiy Custom XSS Options here
const sanitizer = new xss.FilterXSS(xssOptions);

/**
 * Helper Methods
 */
function createPinpointEvent (preferenceCenterID, eventType, endpoint, attributes) {
  if(!endpoint) endpoint = {};
  if(!attributes) attributes = {};

  var customEvent = {
    Endpoint: endpoint,
    Events: {}
  }

  customEvent.Events[`preferenceCenter_${preferenceCenterID}`] = {
    EventType: eventType,
    Timestamp: moment().toISOString(),
    Attributes: attributes
  }
  return customEvent
}

function processEvents (projectId, events) {
  return new Promise((resolve) => {
    var params = {
      ApplicationId: projectId,
      EventsRequest: {
        BatchItem: events
      }
    }
    
    console.log(params)

    pinpoint.putEvents(params, function (err) {
      if (err) {
        console.log(err, err.stack)
        resolve() // Just going to log and return
      } else {
        resolve()
      }
    })
  })
}

function getMetadata(projectID, preferenceCenterID) {
    return new Promise((resolve, reject) => {        
        var params = {
            TableName: METADATA_TABLE,
            Key: {
                projectID : projectID,
                preferenceCenterID : preferenceCenterID
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

function getUserEndpoints(projectID, userID) {
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

function upsertEndpoints(projectID, endpoints) {
  return new Promise((resolve, reject) => {

      var userID = '';
      endpoints.forEach(endpoint => {
        if(endpoint.User.UserId) userID = endpoint.User.UserId;
      });

      if(!userID) userID = uuidv4(); //New user so generate a UUID

      //Run these synchronously so we don't hammer the API  
      endpoints.reduce( (previousPromise, nextEndpoint) => {
        return previousPromise.then(() => {
          return upsertEndpoint(projectID, userID, nextEndpoint);
        });
      }, Promise.resolve())
      .then(()=>{
        resolve(userID);
      });

  });
}
function upsertEndpoint(projectID, userID, endpoint) {
  return new Promise((resolve, reject) => {

      var endpointID = endpoint.Id || uuidv4(); //New Endpoint, go generate a UUID

      endpoint.User.UserId = userID;

      //Remove following attributes...they were part of Get, but the Update doesn't like them
      delete endpoint.ApplicationId;
      delete endpoint.CohortId;
      delete endpoint.CreationDate;
      delete endpoint.Id; 

      //Sanitize all user specified values
      endpoint.Address = sanitizer.process(endpoint.Address);
      for (const property in endpoint.User.UserAttributes) {
            endpoint.User.UserAttributes[property].forEach(value => {
              value = sanitizer.process(value);
            });
      }
     
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
            "Access-Control-Allow-Origin": CORS_DOMAIN, // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
    });

    try {
        var preferenceCenterID = event.queryStringParameters && event.queryStringParameters.pcid ? event.queryStringParameters.pcid : 'default';
        var metadata = {}
        var pinpointEvents = {}
        var projectID = event.pathParameters.projectID

        switch (event.httpMethod) {
            case 'GET':
                if (event.pathParameters && projectID) {
                    if(event.pathParameters.userID){
                        //requesting an enpoint
                        var endpoints = []
                        var userID = event.pathParameters.userID
                        getUserEndpoints(projectID, userID)
                        .then(function(returnedEndpoints) {
                            endpoints = returnedEndpoints
                            pinpointEvents[projectID] = createPinpointEvent(preferenceCenterID, 'preferenceCenter_getUser', {}, {'userID':userID})
                            return processEvents(projectID, pinpointEvents)
                        })
                        .then(function (){
                            done(null, endpoints);
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
                            getMetadata(projectID, preferenceCenterID)
                            .then(function(returnedMetadata) {
                                metadata = returnedMetadata
                                pinpointEvents[projectID] = createPinpointEvent(preferenceCenterID, 'preferenceCenter_open')
                                return processEvents(projectID, pinpointEvents)
                            })
                            .then(function(){
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
                if (event.pathParameters){
                  var endpoints = JSON.parse(event.body);
                    
                  upsertEndpoints(projectID, endpoints)
                  .then(function(userID) {
                      return getUserEndpoints(projectID, userID);
                  })
                  .then(function(returnedEndpoints) {
                      endpoints = returnedEndpoints
                      endpoints.forEach(endpoint => {
                        //TODO: review with Ryan and Ilya to see why I have to do this...also review this event looks good.
                        //Remove following attributes...they were part of Get, but the Update doesn't like them
                        delete endpoint.ApplicationId;
                        delete endpoint.CohortId;
                        delete endpoint.CreationDate;
                        delete endpoint.Id; 
                        pinpointEvents[projectID] = createPinpointEvent(preferenceCenterID, 'preferenceCenter_updateEndpoint', endpoint, {})
                      });
                      return processEvents(projectID, pinpointEvents)
                  }).then(function(){
                      done(null, endpoints);
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
