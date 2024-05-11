import json
from fastapi import HTTPException, Request
import os

CURRENT_ENV = os.environ.get("CURRENT_ENV")


def get_claims(request: Request):
    if CURRENT_ENV == "local-dev" or CURRENT_ENV == "testing":
        return {
            "cognito:username": "695ec448-8051-7066-43c8-d7248497fd3c",
            "given_name": "Test",
            "family_name": "Holmes",
            "email": "oliver.holmes@csiro.au",
        }

    claims_json = request.headers.get("Claims")
    if not claims_json:
        raise HTTPException(status_code=401, detail="Claims not found")

    try:
        return json.loads(claims_json) if claims_json else {}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid claims format")
