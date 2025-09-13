from datetime import datetime
from typing import Optional, Dict
from enum import Enum
import uuid
from pydantic import BaseModel, Field, validator

class UserType(str, Enum):
    FARMER = "farmer"
    RETAILER = "retailer"
    LABORER = "laborer"

class Rating(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user_id: str
    from_user_type: UserType
    to_user_id: str
    to_user_type: UserType
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    transaction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @validator('comment')
    def validate_comment(cls, v, values):
        if values.get('rating', 5) < 5 and not v:
            raise ValueError('Comment is required for ratings less than 5 stars')
        return v

class RatingSummary(BaseModel):
    user_id: str
    user_type: UserType
    average_rating: float
    total_ratings: int
    rating_distribution: Dict[int, int]
    last_updated: datetime

class RatingRequest(BaseModel):
    from_user_id: str
    from_user_type: UserType
    to_user_id: str
    to_user_type: UserType
    rating: int
    comment: Optional[str] = None
    transaction_id: Optional[str] = None

class RatingResponse(BaseModel):
    success: bool
    message: str
    rating: Optional[Rating] = None
    error: Optional[str] = None