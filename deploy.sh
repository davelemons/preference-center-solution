#!/bin/bash
#
# This assumes all of the OS-level configuration has been completed and git repo has already been cloned
#
# This script should be run from the repo's root directory
# ./deploy.sh source-bucket-base-name
#
# Paramenters:
#  - stack-name: (optional) - The name for the cloudformation stack. If no name is specified, 'preference-center' will be used
#  - pinpoint-project-id: (optional) - If specified, will tie preference center resources to the given project/application id.  If not specified, will create a new Pinpoint project.

PCName=${1:-preference-center}
PinpointProjectID=${2:-}

echo "------------------------------------------------------------------------------"
echo "Deploying Cloud Formation Template"
echo "------------------------------------------------------------------------------"
aws cloudformation deploy --template-file packaged-template.yaml --stack-name $PCName --capabilities CAPABILITY_IAM --parameter-overrides PinpointProjectId=$PinpointProjectID