import os

import boto3
from dotenv import load_dotenv
from fastapi import HTTPException

import hmac
import hashlib
import base64

load_dotenv()

CURRENT_ENV = os.environ.get("CURRENT_ENV")
REGION_NAME = os.environ.get("REGION_NAME")
COGNITO_USER_POOL_ID = os.environ.get("COGNITO_USER_POOL_ID")
COGNITO_CLIENT_ID = os.environ.get("COGNITO_CLIENT_ID")
COGNITO_CLIENT_SECRET = os.environ.get("COGNITO_CLIENT_SECRET")

try:
    client = boto3.client("cognito-idp", region_name=REGION_NAME)
except Exception as e:
    print(f"Error initializing AWS Cognito client: {e}")
    raise


def get_token(username: str, password: str):  # pragma: no cover
    # Generate the secret hash
    secret_hash = base64.b64encode(
        hmac.new(
            COGNITO_CLIENT_SECRET.encode("utf-8"),
            username.encode("utf-8") + COGNITO_CLIENT_ID.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    ).decode("utf-8")
    # Input validation can be added here if needed
    try:
        response = client.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password,
                "SECRET_HASH": secret_hash,
            },
        )
    except client.exceptions.NotAuthorizedException:
        raise HTTPException(status_code=401, detail="Unauthorized")
    except Exception as e:
        # Log the exception details
        print(f"Error during authentication: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    id_token = response.get("AuthenticationResult", {}).get("IdToken")
    if not id_token:
        raise HTTPException(status_code=500, detail="ID token not received")

    return id_token


def get_user_name_from_cognito(cognito_username):
    if CURRENT_ENV == "testing" and cognito_username == "user_uuid":
        return "Test", "User"
    else:
        try:
            # Retrieve the user details
            response = client.admin_get_user(
                UserPoolId=COGNITO_USER_POOL_ID, Username=cognito_username
            )

            # Extract the attributes and convert them to a dictionary for easier access
            user_attributes = {
                attr["Name"]: attr["Value"] for attr in response["UserAttributes"]
            }

            first_name = user_attributes.get("given_name", "")
            last_name = user_attributes.get("family_name", "")

            return first_name, last_name

        except client.exceptions.UserNotFoundException:
            print(f"User {cognito_username} not found in Cognito user pool.")
            return None, None
        except Exception as e:
            print(f"Failed to retrieve user details for {cognito_username}: {e}")
            return None, None
