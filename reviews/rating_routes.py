from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from rating_models import Rating, RatingSummary, RatingRequest, RatingResponse, UserType
from rating_service import rating_service

router = APIRouter(prefix="/api/ratings", tags=["ratings"])

@router.post("/", response_model=RatingResponse)
async def create_rating(rating_request: RatingRequest):
    result = await rating_service.create_rating(rating_request)
    
    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)
    
    return result

@router.get("/user/{user_id}/{user_type}", response_model=List[Rating])
async def get_user_ratings(
    user_id: str,
    user_type: UserType,
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    return await rating_service.get_ratings_for_user(user_id, user_type, limit, skip)

@router.get("/summary/{user_id}/{user_type}", response_model=RatingSummary)
async def get_user_rating_summary(user_id: str, user_type: UserType):
    return await rating_service.get_rating_summary(user_id, user_type)

@router.get("/recent/{user_id}/{user_type}", response_model=List[Rating])
async def get_recent_ratings(
    user_id: str,
    user_type: UserType,
    days: int = Query(30, ge=1, le=365)
):
    return await rating_service.get_recent_ratings(user_id, user_type, days)

@router.get("/given/{user_id}/{user_type}", response_model=List[Rating])
async def get_ratings_given_by_user(
    user_id: str,
    user_type: UserType,
    limit: int = Query(20, ge=1, le=100)
):
    return await rating_service.get_ratings_by_user(user_id, user_type, limit)

@router.get("/check-rating/{from_user_id}/{to_user_id}")
async def check_existing_rating(
    from_user_id: str,
    to_user_id: str,
    transaction_id: Optional[str] = None
):
    has_rated = await rating_service.has_user_rated(from_user_id, to_user_id, transaction_id)
    return {"has_rated": has_rated}

@router.get("/export")
async def export_rating_data():
    data = await rating_service.export_data()
    return {"data": data}

@router.post("/import")
async def import_rating_data(json_data: str):
    await rating_service.import_data(json_data)
    return {"message": "Data imported successfully"}