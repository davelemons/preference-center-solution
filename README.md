# preference-center-solution [WIP]
Cloudformation template to deploy a fully functional Preference Center to collect end-user preferences for Pinpoint marketing campaigns.

## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown): `npm install -g jsdoc-to-markdown`
- [AWS Cloudformation CLI](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/what-is-cloudformation-cli.html)
- Access to an AWS account Isengard and ability to connect with AWS CLI.  Execute `aws s3 ls` to verify connection
- An existing S3 bucket to package code to: `aws s3 mb [unique bucket name]`

## Getting Started
- Clone this repo
- Build: `./build.sh [s3 bucket name from above]`
- Deploy: `./deploy.sh` This accepts optional parameters to specify the cloudformation stack name and pinpoint project/application ID.  If not specified it will use `preference-center` as the stack name and generate a new Pinpoint Project.
- Wait for Cloudformation build to complete and examine outputs which will have resulting Preference Center URLs

The preference center allows for several querystring parameters:
- **pid** - [Required] Pinpoint Project ID: The Pinpoint project/application id associated with this preference center.  This is also the Primary Partition Key[projectID] of the metadata document in DynamoDB.
- **pcid** - [Optional] Preference Center ID: The Preference Center ID.  This is also the Primary Sort Key [preferenceCenterID] of the metadata document in DynamoDB.  If not specified, the API will return the metadata document with `default` as the Sort Key.  This is super useful if you want to create different preference centers for different brands or languages. For example you could have a **pcid** of **ja** to render a preference center in Japanese. 
- **uid** - [Optional]  User ID: The User.UserID to retrieve attribute and publication information for.  If not specified, the form will allow for the opt-in of end-users.  It will generate a UUID for any User and Endpoint IDs.

## Customizing
- All text, attributes, categories, and publications can be customized by modifying the metadata stored in DynamoDB.  See the [Annotated Metadata](annotated-metadata.md) to see a commented json file.
- Styles are best overridden by updating [main.css](static-assets/css/main.css)
- HTML can be modified by updating the Handlebars template in [index.html](static-assets/index.html)
- Javascript can be modified by updating [main.js](static-assets/js/main.js)  Although, this should be done with caution.
- Front-end development can be done locally, but you will want to upate the **Access-Control-Allow-Origin** header to '*' in API gateway and the Lambda function so you don't get into CORS trouble.  You will also need to temporarily hardcode the values at the top of [main.js](static-assets/js/main.js) with appropriate values:
```js
const apiKey = '${API_KEY}'
const baseURL = '${API_URL}'
```

## TODO
- [ ] Unit Tests
- [x] DynamoDB Trigger to update segments based on publications in the metadata
- [ ] Unsubscribe Survey...maybe
- [ ] Sample template with links to Optin, Manage Preferences for Existing User...maybe (these are already in outputs)
- [ ] Lots of testing
- [ ] REST API Swagger Docs
- [ ] AWS Solution Tasks