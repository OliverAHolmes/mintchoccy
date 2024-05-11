from aws_cdk import (
    Stack,
    Duration,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    aws_certificatemanager as acm,
    aws_iam as iam,
    aws_route53 as route53,
    aws_route53_targets as targets,
    aws_ec2 as ec2,
    aws_ecr as ecr,
    aws_cognito as cognito,
    aws_secretsmanager as secretsmanager,
    SecretValue,
)

from constructs import Construct

import datetime


class MintApiStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        cognito_user_pool = cognito.UserPool(
            self,
            "MintUserPool",
            auto_verify=cognito.AutoVerifiedAttrs(email=True, phone=True),
            standard_attributes=cognito.StandardAttributes(
                email=cognito.StandardAttribute(mutable=True, required=True),
                given_name=cognito.StandardAttribute(mutable=True, required=True),
                family_name=cognito.StandardAttribute(mutable=True, required=True),
            ),
        )

        client = cognito_user_pool.add_client(
            "MintUserPoolClient",
            auth_flows=cognito.AuthFlow(
                user_password=True,
                admin_user_password=True,
                user_srp=True,
            ),
            prevent_user_existence_errors=True,
        )

        # Add user pool details to the secrets manager
        cognito_user_pool_id = cognito_user_pool.user_pool_id
        cognito_user_pool_arn = cognito_user_pool.user_pool_arn
        client_id = client.user_pool_client_id

        # Create the secret
        secretsmanager.Secret(
            self,
            "CognitoUserPoolSecret",
            secret_name="api/mint/cognitoUserPoolSecrets",
            description="Cognito User Pool Secrets",
            secret_object_value={
                "MINT_USER_POOL_ID": SecretValue.unsafe_plain_text(
                    cognito_user_pool_id
                ),
                "MINT_USER_POOL_ARN": SecretValue.unsafe_plain_text(
                    cognito_user_pool_arn
                ),
                "MINT_USER_POOL_CLIENT_ID": SecretValue.unsafe_plain_text(client_id),
            },
        )

        # Create the Lambda function
        api_lambda = _lambda.Function(
            self,
            "MintApiLambda",
            code=_lambda.Code.from_ecr_image(
                repository=ecr.Repository.from_repository_arn(
                    self,
                    id="mint-choccy-api",
                    repository_arn="arn:aws:ecr:ap-southeast-2:208792096778:repository/mint-choccy-api",
                ),
                tag_or_digest="latest",
            ),
            function_name="MintApiLambda",
            runtime=_lambda.Runtime.FROM_IMAGE,
            handler=_lambda.Handler.FROM_IMAGE,
            architecture=_lambda.Architecture.ARM_64,
            timeout=Duration.minutes(5),  # Set the timeout to 5 minutes
            memory_size=1024,  # Set the memory size to 1024 MB
            description=f"Deployed on {datetime.datetime.now()}",
            environment={
                "COGNITO_USER_POOL_ID": cognito_user_pool_id,
                "COGNITO_CLIENT_ID": client_id,
                "REGION_NAME": "ap-southeast-2",
                "CURRENT_ENV": "prod",
            },
        )

        certificate = acm.Certificate.from_certificate_arn(
            self,
            "Certificate",
            certificate_arn="arn:aws:acm:us-east-1:208792096778:certificate/d5b1fcbc-6900-483d-b9d9-e07f3744ff3a",
        )

        hosted_zone_id = "Z01481177V8891T4YAVP"
        domain_name = "mintchoccy.com"

        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self, "HostedZone", hosted_zone_id=hosted_zone_id, zone_name=domain_name
        )

        domain_name_ext = "api"
        domain_name_with_ext = f"{domain_name_ext}." + domain_name

        cognito_user_pools_authorizer = apigateway.CognitoUserPoolsAuthorizer(
            self,
            "MintCognitoAuthorizer",
            cognito_user_pools=[
                cognito.UserPool.from_user_pool_id(
                    self,
                    "MintUserPool",
                    user_pool_id=cognito_user_pool_id,
                )
            ],
        )

        # Create the API Gateway
        api = apigateway.LambdaRestApi(
            self,
            "MintApiGateway",
            handler=api_lambda,
            domain_name=apigateway.DomainNameOptions(
                domain_name=domain_name_with_ext,
                certificate=certificate,
                security_policy=apigateway.SecurityPolicy.TLS_1_2,
                endpoint_type=apigateway.EndpointType.EDGE,
            ),
            deploy_options={"stage_name": "prod"},
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
            ),
            default_method_options=apigateway.MethodOptions(
                authorizer=cognito_user_pools_authorizer,
                authorization_type=apigateway.AuthorizationType.COGNITO,
            ),
        )

        for method in api.methods:
            if method.http_method == "OPTIONS":
                method.node.find_child("Resource").add_property_override(
                    "AuthorizationType", "NONE"
                )

        # Create unprotected '/login' resource
        login_resource = api.root.add_resource("login")
        login_method = login_resource.add_method(
            "GET",  # Assuming you're using GET for login
            apigateway.LambdaIntegration(api_lambda),
        )

        # Override the authorizer for '/login' to NONE
        login_method.node.find_child("Resource").add_property_override(
            "AuthorizationType", "NONE"
        )

        # # Create unprotected '/health' resource
        health_resource = api.root.add_resource("health")
        health_method = health_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(api_lambda),
        )

        # Override the authorizer for '/health' to NONE
        health_method.node.find_child("Resource").add_property_override(
            "AuthorizationType", "NONE"
        )

        route53.ARecord(
            self,
            "MintApiRecord",
            record_name=domain_name_ext,
            zone=hosted_zone,
            target=route53.RecordTarget.from_alias(targets.ApiGateway(api)),
        )
