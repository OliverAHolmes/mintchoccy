from fastapi import APIRouter, Depends
from services.aws_claims import get_claims

router = APIRouter()


@router.get("")
async def get_user_details(
    claims: str = Depends(get_claims),
):
    return claims
