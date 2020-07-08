console.log('Loading function');
var AWS = require("aws-sdk");
const pinpoint = new AWS.Pinpoint({region: process.env.REGION});

//Pull in DocumentClient so we can translate DynamoDB format into easier things to parse
var docClient =  new AWS.DynamoDB.DocumentClient();
var dynamodbTranslator = docClient.getTranslator();
var ItemShape = docClient.service.api.operations.getItem.output.members.Item;

 /**
 * Writes a batch of custom pinpoint events
 * @param  {String} projectId The pinpoint application/project id to associate the events with
 * @param  {String} preferenceCenterID The preference center id
 * @return {Promise} A Promise object that contatins the metadata retrieved from DynamoDB
 */
function getSegments(projectID) {
  return new Promise((resolve, reject) => {        
    var params = {
      ApplicationId: projectID
    };
    pinpoint.getSegments(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }     
    });
  });
}

function createSegment(projectID, segment) {
  return new Promise((resolve, reject) => {  
    
    resolve(); //Just resolve for now while we work on this.

    segment = {
      "Name": "PC_runnersMonthly_EMAIL2",
      "SegmentGroups": {
          "Groups": [
              {
                  "Dimensions": [
                      {
                          "Demographic": {
                              "Channel": {
                                  "DimensionType": "INCLUSIVE",
                                  "Values": [
                                      "EMAIL"
                                  ]
                              }
                          }
                      },
                      {
                          "UserAttributes": {
                              "runnersMonthly": {
                                  "AttributeType": "INCLUSIVE",
                                  "Values": [
                                      "EMAIL"
                                  ]
                              }
                          }
                      }
                  ]
              }
          ],
          "Include": "ALL"
      }
    }
    
    var params = {
      ApplicationId: projectID,
      WriteSegmentRequest: segment
    };
    pinpoint.createSegment(params, function(err, data) {
      if (err) {
        console.log("createSegmentFailure", err)
        reject(err)
      } else {
        console.log("createSegmentSuccess", data)
        resolve(data)
      }     
    });
  });
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        // Translate into something more sane to read.
        var newImage = dynamodbTranslator.translateOutput(record.dynamodb.NewImage, ItemShape);
        console.log('DynamoDB NewImage: %j', newImage);

        // Build Segments
        var segments = [];
        newImage.categories.forEach(function (category, index) {
          category.publications.forEach(function (publication, index) {
            newImage.availableChannels.forEach(function (channel, index) {
              segments.push(`${publication.id}_${channel.id}`)
            })
          })
        })

        console.log(newImage)
        getSegments(newImage.projectID)
        .then( function(segments) {
          console.log(JSON.stringify(segments, null, 2));
          return createSegment(newImage.projectID);
        })
        .then(function(results){
          callback(null, `Successfully processed ${event.Records.length} records.`);
        })
        .catch(function(err){
          //TODO: what do I do with this?
          console.log(err);
          callback(null, `Error`);
        });
    }
};

/*
TemplateSegment
{
  "Name": "PC_runnersMonthly_EMAIL2",
  "SegmentGroups": {
      "Groups": [
          {
              "Dimensions": [
                  {
                      "Demographic": {
                          "Channel": {
                              "DimensionType": "INCLUSIVE",
                              "Values": [
                                  "EMAIL"
                              ]
                          }
                      }
                  },
                  {
                      "UserAttributes": {
                          "runnersMonthly": {
                              "AttributeType": "INCLUSIVE",
                              "Values": [
                                  "EMAIL"
                              ]
                          }
                      }
                  }
              ]
          }
      ],
      "Include": "ALL"
  }
}
*/
