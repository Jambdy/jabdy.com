+++
title = "Simple SAM"
description = "Use AWS SAM to deploy simple serverless backend"
tags = [
"AWS",
"Personal Project",
"Famous Fishbowl"
]
date = 2023-09-28
author = "James Abdy"
+++

<img class="center" style="width:200px" src="/img/simple_sam/sam_squirrel.png">

I previously created a party game app in Flutter called Famous Fishbowl. It has a basic backend in AWS to store and return data into/from a DynamoDB table via API Gateway and Lambda functions. I initially created the services manually in the AWS console but decided to work backwards and create a deployment template for it. I did this for practice, to enable ease of re-use in future projects, and to pad my personal GitHub :).

I have experience deploying AWS infrastructure with Serverless Framework at work but decided to use AWS SAM in this project to gain exposure to another deployment option.

## Setup SAM

Since this was my first time using AWS SAM, I needed to install the SAM CLI ([instructions] (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)).

Once installed, I ran the "sam init" command to initialize the project. I selected the hello world quick template with a python runtime. It looked as follows:

~~~
sam init

Which template source would you like to use?
        1 - AWS Quick Start Templates
        2 - Custom Template Location
Choice: 1

Choose an AWS Quick Start application template
        1 - Hello World Example
        2 - Data processing
        3 - Hello World Example with Powertools for AWS Lambda
        4 - Multi-step workflow
        5 - Scheduled task
        6 - Standalone function
        7 - Serverless API
        8 - Infrastructure event management
        9 - Lambda Response Streaming
        10 - Serverless Connector Hello World Example
        11 - Multi-step workflow with Connectors
        12 - GraphQLApi Hello World Example
        13 - Full Stack
        14 - Lambda EFS example
        15 - Hello World Example With Powertools for AWS Lambda
        16 - DynamoDB Example
        17 - Machine Learning
Template: 1

Use the most popular runtime and package type? (Python and zip) [y/N]: y

Would you like to enable X-Ray tracing on the function(s) in your application?  [y/N]: N

Would you like to enable monitoring using CloudWatch Application Insights?
For more info, please view https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html [y/N]: N

Project name [sam-app]: famous-fishbow-backend
~~~

The hello world template creates a basic hello world lambda function that is invoked from a GET method in an API in API Gateway.

## Updates for Famous Fishbowl Backend

In order to support the Famous Fishbowl app, I needed a function that could insert, update, retrieve, and delete records in a DynamoDB table. To do this, I renamed the helloworld function to FamousFishbowlCRUDFunction and added the following code in the app.py file:

~~~
import simplejson as json
import boto3


def lambda_handler(event, _):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('famous-fishbowl')
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,DELETE',
        'Access-Control-Allow-Credentials': True
    }
    body = ''
    status_code = 200

    try:
        if event['httpMethod'] == 'DELETE':
            id_str = event['pathParameters']['id']
            table.delete_item(
                Key={
                    'id': id_str
                }
            )
            body = f'Deleted item {id_str}'
        elif event['httpMethod'] == 'GET':
            id_str = event['pathParameters']['id']
            response = table.get_item(
                Key={
                    'id': id_str
                }
            )
            if 'Item' in response:
                item = response['Item']
                body = json.dumps(item, use_decimal=True)
            else:
                status_code = 404
                body = f'Game {id_str} not found'
        elif event['httpMethod'] == 'PUT':
            request_json = json.loads(event['body'])
            table.put_item(
                Item={
                    'id': request_json['id'],
                    'state': request_json['state'],
                    'creationTime': request_json['creationTime'],
                    'completionTime': request_json['completionTime'],
                    'categories': request_json['categories'],
                    'names': request_json['names'],
                    'round': request_json['round'],
                    'curTeam': request_json['curTeam'],
                    'teamScores': request_json['teamScores'],
                    'timeRemaining': request_json['timeRemaining'],
                    'turnResumeTime': request_json['turnResumeTime']
                }
            )
            body = f'Put Game {request_json["id"]}'
    except Exception as err:
        body = f"Unexpected {err}, {type(err)}"
        print(body)
        status_code = 400

    return {
        'statusCode': status_code,
        'body': body,
        'headers': headers
    }
~~~

The corresponding entry in the template.yaml file was:

~~~
  FamousFishbowlCRUDFunction:
    Type: AWS::Serverless::Function # More info about Function Resource: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
    Properties:
      CodeUri: famous_fishbowl_CRUD/
      Handler: app.lambda_handler
      Runtime: python3.9
      Architectures:
        - x86_64
      Events:
        PutGame:
          Type: Api
          Properties:
            RestApiId: !Ref FamousFishbowlAPI
            Path: /games
            Method: put
            Auth:
              ApiKeyRequired: true
        GetGame:
          Type: Api
          Properties:
            RestApiId: !Ref FamousFishbowlAPI
            Path: /games/{id}
            Method: get
            Auth:
              ApiKeyRequired: true
        DeleteGame:
          Type: Api
          Properties:
            RestApiId: !Ref FamousFishbowlAPI
            Path: /games/{id}
            Method: delete
            Auth:
              ApiKeyRequired: true
~~~

The PutGame, GetGame, and DeleteGame entries in the events section add separate methods to the API in API Gateway. The Lambda function uses the httpMethod parameter to process events accordingly. This function could be split up into three separate functions, but that seemed somewhat unnecessary due to the limited complexity.

Next to create the DynamoDB table, I added the following to the resources section of the template.yaml file:

~~~
  FishbowlDynamoDB:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String
      TableName: famous-fishbowl
~~~

I granted permission to the Lambda function to write from and read to the DynamoDB with the SAM Connector resource type:

~~~
  LambdaDynamoDbConnector:
    Type: AWS::Serverless::Connector
    Properties:
      Source:
        Id: FamousFishbowlCRUDFunction
      Destination:
        Id: FishbowlDynamoDB
      Permissions:
        - Write
        - Read
~~~

In order to enable CORS, I included related headers like Access-Control-Allow-Origin in the Lambda function response (needed when proxy integration is used in the API Gateway method). I also added the following to the Globals section in the template.yaml file:

~~~
  Api:
    Cors:
      AllowMethods: "'OPTIONS,PUT,GET,DELETE'"
      AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
      AllowOrigin: "'*'"
~~~

Finally, to add some basic security I added an API Key to the API. To do this, I defined a Usage Plan for the API resource (shown below) and set "ApiKeyRequired: true" in the method events for the Lambda function. It was important to set the ApiKeyRequired property at the individual method level and not at the API level as that disrupted the OPTIONS methods used to enable CORS.

~~~
  FamousFishbowlAPI:
    Type: AWS::Serverless::Api
    Properties:
      StageName: Prod
      Auth:
        UsagePlan:
          CreateUsagePlan: PER_API
          UsagePlanName: GatewayAuthorization
~~~

## Setup GitHub Actions

After I had all the resources setup to support the app backend, I decided to deploy the stack via GitHub Actions. To do this I added a directory to my repository called .github/workflows with a file called deploy.yaml. It contained the following:

~~~
name: Build and deploy to AWS
on:
  push:
    branches: [ main ]
jobs:
  build_deploy:
    name: Build backend and deploy to AWS
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - uses: actions/setup-python@v2
      - uses: aws-actions/setup-sam@v1
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: 'us-east-1'
      - run: sam build --use-container
      - run: sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --stack-name famous-fishbowl-backend --capabilities CAPABILITY_IAM --region us-east-1
~~~

The on push part specifies the action to trigger whenever a push to the main branch occurs. Access to my AWS account is achieved by using credential stored in GitHub secrets. The SAM CLI is setup and then the stack is prepared for deployment with:

~~~
sam build --use-container
~~~

The stack is then deployed with:

~~~
run: sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --stack-name famous-fishbowl-backend --capabilities CAPABILITY_IAM --region us-east-1
~~~

After a successful deployment, a Cloudformation stack with the given name (in this case famous-fishbowl-backend) can be found in the AWS account.

## Conclusion

Defining and deploying the serverless infrastructure for the app was easy with AWS SAM. Some differences I noticed compared to Serverless Framework were:

* Access to simplified resource types like AWS::Serverless::SimpleTable and AWS::Serverless::Connector
* A clear summary changes outputted during deployment

I will probably continue to use AWS SAM for future projects.

[Link to GitHub project] (https://github.com/Jambdy/famous-fishbowl-backend)

## References

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html

https://aws.amazon.com/blogs/compute/using-github-actions-to-deploy-serverless-applications/