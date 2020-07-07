# preference-center-solution [WIP]
Cloudformation template to deploy a fully functional Preference Center to collect end-user preferences for Pinpoint marketing campaigns.

## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown): `npm install -g jsdoc-to-markdown`
- [AWS Cloudformation CLI](https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/what-is-cloudformation-cli.html)
- Access to an AWS account Isengard and ability to connect with AWS CLI.  Execute `aws s3 ls` to verify connection
- An existing S3 bucket to package code to: `aws mb [unique bucket name]`

## Getting Started
- Clone this repo: `git clone https://github.com/davelemons/preference-center-solution.git && cd preference-center-solution`
- Build: `./build.sh [s3 bucket name from above]`
- Deploy: `./deploy.sh` This accepts optional parameters to specify the cloudformation stack name and pinpoint project/application ID.  If not specified it will use `preference-center` as the stack name and generate a new Pinpoint Project.
- Wait for Cloudformation build to complete and examine outputs which will have resulting Preference Center URLs
