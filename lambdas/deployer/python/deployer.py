# MIT License
# Copyright 2020 Aleksandar Simovic <https://serverless.pub>
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# davelem@: modified to filter .DS_Store and ignore sed replacement errors.

import os
import boto3
import mimetypes
import json
import requests
import subprocess
import tempfile
import pathlib
import shutil

s3 = boto3.resource('s3')
defaultContentType = 'application/octet-stream'

def resource_handler(event, context):
  print(event)
  try:
    target_bucket = event['ResourceProperties']['TargetBucket']
    lambda_src = os.getcwd()
    acl = event['ResourceProperties']['Acl']
    cacheControl = 'max-age=' + \
        event['ResourceProperties']['CacheControlMaxAge']
    print(event['RequestType'])
    if event['RequestType'] == 'Create' or event['RequestType'] == 'Update':
      
      if 'Substitutions' in event['ResourceProperties'].keys():
        temp_dir = os.path.join(tempfile.mkdtemp(), context.aws_request_id)
        apply_substitutions(event['ResourceProperties']['Substitutions'], temp_dir)
        lambda_src = temp_dir

      print('uploading')
      upload(lambda_src, target_bucket, acl, cacheControl)
    elif event['RequestType'] == 'Delete':
      delete(lambda_src, target_bucket, s3)
    else:
      print('ignoring')

    if not lambda_src == os.getcwd():
      print('removing temporary', lambda_src)
      shutil.rmtree(lambda_src)
    send_result(event)

  except Exception as err:
    send_error(event, err)
  return event


def upload(lambda_src, target_bucket, acl, cacheControl):
  for folder, subs, files in os.walk(lambda_src):
    for filename in files:
        if not filename == '.DS_Store':
          source_file_path = os.path.join(folder, filename)
          destination_s3_key = os.path.relpath(source_file_path, lambda_src)
          contentType, encoding = mimetypes.guess_type(source_file_path)
          upload_file(source_file_path, target_bucket,
                      destination_s3_key, s3, acl, cacheControl, contentType)


def upload_file(source, bucket, key, s3lib, acl, cacheControl, contentType):
    print('uploading from {} {} {}'.format(source, bucket, key))
    contentType = contentType or defaultContentType
    s3lib.Object(bucket, key).put(ACL=acl, Body=open(source, 'rb'),
                                  CacheControl=cacheControl, ContentType=contentType)

def delete(lambda_src, target_bucket, s3lib):
  for folder, subs, files in os.walk(lambda_src):
    for filename in files:
        source_file_path = os.path.join(folder, filename)
        destination_s3_key = os.path.relpath(source_file_path, lambda_src)
        print('deleting file {} from {}'.format(destination_s3_key, target_bucket))
        s3lib.Object(target_bucket, destination_s3_key).delete()

def send_result(event):
  response_body = json.dumps({
    'Status': 'SUCCESS',
    'PhysicalResourceId': get_physical_resource_id(event),
    'StackId': event['StackId'],
    'RequestId': event['RequestId'],
    'LogicalResourceId': event['LogicalResourceId']
  })
  print(response_body)
  requests.put(event['ResponseURL'], data=response_body)


def send_error(event, error):
  response_body = json.dumps({
    'Status': 'FAILED',
    'Reason': str(error),
    'PhysicalResourceId': get_physical_resource_id(event),
    'StackId': event['StackId'],
    'RequestId': event['RequestId'],
    'LogicalResourceId': event['LogicalResourceId']
  })
  print(response_body)
  requests.put(event['ResponseURL'], data=response_body)

def get_physical_resource_id(event):
  if 'PhysicalResourceId' in event.keys():
    return event['PhysicalResourceId']
  else:
    return event['RequestId']

def apply_substitutions(substitutions, temp_dir):
  if not 'Values' in substitutions.keys():
    raise ValueError('Substitutions must contain Values')

  if not isinstance(substitutions['Values'], dict):
    raise ValueError('Substitutions.Values must be an Object')

  if len(substitutions['Values']) < 1:
    raise ValueError('Substitutions.Values must not be empty')

  if not 'FilePattern' in substitutions.keys():
    raise ValueError('Substitutions must contain FilePattern')

  if not isinstance(substitutions['FilePattern'], str):
    raise ValueError('Substitutions.FilePattern must be a String')

  if len(substitutions['FilePattern']) < 1:
    raise ValueError('Substitutions.FilePattern must not be empty')

  values = substitutions['Values']
  file_pattern = substitutions['FilePattern']

  subprocess.run(['cp', '-r', os.getcwd(), temp_dir])

  for full_path in pathlib.Path(temp_dir).glob(file_pattern):
    replace_with_command = lambda key: 's/\\${%s}/%s/g'% (sed_escape(key), sed_escape(values[key]))
    replacements = list(map(replace_with_command, values.keys()))
    sed_script = ';'.join(replacements)
    subprocess.run(['sed', sed_script, '-i', str(full_path)], cwd=tempfile.gettempdir(), check=False)

def sed_escape(text):
 return text.replace('/', '\\/')
