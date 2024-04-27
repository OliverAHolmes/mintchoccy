from mangum import Mangum
from main import app
import json


def lambda_handler(event, context):
    # Extract claims from the event object
    claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})

    # Serialize claims dictionary to a JSON string
    event["headers"]["Claims"] = json.dumps(claims)

    mangum_handler = Mangum(app, lifespan="off")

    max_retries = 3  # Maximum number of retry attempts

    for attempt in range(max_retries):
        try:
            # Attempt to handle the request
            response = mangum_handler(event, context)
            return response
        except Exception as e:
            # Log the exception; you might want to check for specific exceptions
            print(f"Attempt {attempt + 1} failed with exception: {e}")
            if not attempt < max_retries - 1:
                raise  # pragma: no cover
