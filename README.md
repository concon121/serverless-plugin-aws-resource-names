# serverless-plugin-aws-resource-names

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

Serverless plugin to enable custom AWS resource names

## Usage

Install the plugin to your project:

    npm install serverless-aws-resource-names --save

Add the plugin and its configuration to your serverless project:

    plugins:
      - serverless-aws-resource-names
    custom:
      serverless-aws-resource-names:
        source: mapping.json

Create the `mapping.json` file in your project and modify the names to your hearts desire!

    {
        "template": {
            "compiled": "cloudformation-template-update-stack.json",
            "core": "cloudformation-template-create-stack.json"
        },
        "stack": "$service-$stage",
        "role": {
            "Fn::Join": [
                "-", [
                    "$service",
                    "$stage",
                    "$region",
                    "lambdaRole"
                ]
            ]
        },
        "policy": {
            "Fn::Join": [
                "-", [
                    "$stage",
                    "$service",
                    "lambda"
                ]
            ]
        },
        "apiGateway": "$stage-$service",
        "lambda": "$service-$stage-$lambda",
        "logGroup": "/aws/lambda/$service-$stage-$lambda"
    }

### Mapping Variable Reference

-   **$service** - Refers to the service attribute in your serverless.yml
-   **$stage** - Refers to the stage which you deploy to via serverless e.g. sls deploy **-s dev**
-   **$region** - Refers to the AWS region that you are deploying to.  This is configured in your serverless.yml under the _provider.region_ attribute or by your AWS CLI configuration.
-   **$lambda** - Refers to the name of your lambda function, defined in your serverless.yml under the _functions_ attribute.
