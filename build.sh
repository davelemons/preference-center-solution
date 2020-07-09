#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's root directory
# ./build.sh source-bucket-base-name
#
# Paramenters:
#  - source-bucket-base-name: Name for the S3 bucket location where the code will be packaged to


# Check to see if input has been provided:
if [ -z "$1" ]; then
    echo "Please provide the base source bucket name"
    echo "For example: ./build.sh preference-center-code"
    exit 1
fi

echo "------------------------------------------------------------------------------"
echo "Package AWS Lambda Functions"
echo "------------------------------------------------------------------------------"
cd lambdas/rest-api-handler
npm install
jsdoc2md index.js > README.md
cd ../stream-processor
npm install
jsdoc2md index.js > README.md

echo "------------------------------------------------------------------------------"
echo "Build Docs"
echo "------------------------------------------------------------------------------"
cd ../../static-assets/js
jsdoc2md main.js > README.md

echo "------------------------------------------------------------------------------"
echo "Package CloudFormation to S3"
echo "------------------------------------------------------------------------------"
cd ../../
aws cloudformation package --template template.yaml --s3-bucket $1 --output yaml --output-template-file packaged-template.yaml