from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from utils.auth import get_token

router = APIRouter()


@router.get("/login")
async def login(username: str, password: str):
    if username is None or username == "" or password is None or password == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required",
        )
    return JSONResponse(
        content={"token": get_token(username, password)},
        status_code=status.HTTP_201_CREATED,
    )
