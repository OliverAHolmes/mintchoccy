from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

# from starlette.exceptions import HTTPException as StarletteHTTPException


from routers import (
    health,
)

app = FastAPI(
    title="MintChoccy API",
    description="API backend for MintChoccy!",
)

# @app.exception_handler(StarletteHTTPException)
# async def http_exception_handler(request: Request, exc: StarletteHTTPException):
#     return JSONResponse(
#         status_code=exc.status_code,
#         content={"message": "An error occurred", "detail": str(exc.detail)},
#     )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Initialize a list to hold simplified error messages
    simple_errors = []

    # Process each error in the validation exception
    for error in exc.errors():
        field_name = "->".join(map(str, error["loc"]))
        error_msg = error["msg"]

        # For more friendly error messages, you might customize
        # or translate messages here based on error['type'] or error['msg']

        simple_errors.append(f"{field_name}: {error_msg}")

    # Join all simplified error messages into a single string
    detailed_message = " | ".join(simple_errors)

    # Return a custom JSON response with the simplified error message
    return JSONResponse(
        status_code=422,
        content={"detail": f"Validation Error: {detailed_message}"},
    )


# CORS configuration to allow requests from specified origins
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=100)


# Make root route
@app.get("/")
async def root():
    return {"message": "Hello from MintChoccy API!"}


app.include_router(health.router, tags=["health-check"])
