const METADATA_TABLE = process.env.METADATA_TABLE

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();
const pinpoint = new AWS.Pinpoint({region: process.env.region});

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

function getEndpoint(projectID, endpointID) {
    return new Promise((resolve, reject) => {

        var params = {
            ApplicationId: projectID,
            EndpointId: endpointID
        };
        pinpoint.getEndpoint(params, function(err, data) {
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
exports.handler = async (event, context, callback) => {
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
                    if(event.pathParameters.endpointID){
                        //requesting an enpoint
                        getEndpoint(event.pathParameters.projectID, event.pathParameters.endpointID)
                        .then(function(endpoint) {
                            done(null, endpoint);
                        }).catch(function(e) {
                            console.log(e);
                            done(e);
                        });
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
                } else {
                    done({ "status": "error", "message": "Missing Required Parameters." });
                }
                break;
            case 'PUT':
                done(new Error(`Unsupported method "${event.httpMethod}"`));
                break;
            default:
                done(new Error(`Unsupported method "${event.httpMethod}"`));
        }
    } catch (err) {
        console.log(err);
        done({ "status": "error", "message": "Unhandled Error." });
    };
};
