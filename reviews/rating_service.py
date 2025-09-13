from typing import List, Optional, Dict
from datetime import datetime
from rating_models import Rating, RatingSummary, UserType, RatingRequest, RatingResponse
import json

class RatingService:
    def __init__(self):
        self.ratings: List[Rating] = []
        self.rating_summaries: Dict[str, RatingSummary] = {}
        
    async def create_rating(self, rating_request: RatingRequest) -> RatingResponse:
        try:
            if rating_request.rating < 1 or rating_request.rating > 5:
                return RatingResponse(
                    success=False,
                    message="Invalid rating",
                    error="Rating must be between 1 and 5 stars"
                )
            
            if rating_request.rating < 5 and not rating_request.comment:
                return RatingResponse(
                    success=False,
                    message="Comment required",
                    error="Comment is required for ratings less than 5 stars"
                )
            
            if rating_request.transaction_id:
                existing_rating = await self._find_existing_rating(
                    rating_request.from_user_id,
                    rating_request.to_user_id,
                    rating_request.transaction_id
                )
                if existing_rating:
                    return RatingResponse(
                        success=False,
                        message="Already rated",
                        error="You have already rated this user for this transaction"
                    )
            
            rating_data = rating_request.dict()
            rating = Rating(**rating_data)
            
            self.ratings.append(rating)
            await self._update_rating_summary(rating.to_user_id, rating.to_user_type)
            
            return RatingResponse(
                success=True,
                message="Rating submitted successfully",
                rating=rating
            )
            
        except Exception as e:
            return RatingResponse(
                success=False,
                message="Error creating rating",
                error=str(e)
            )
    
    async def get_ratings_for_user(self, user_id: str, user_type: UserType, 
                                 limit: int = 20, skip: int = 0) -> List[Rating]:
        user_ratings = [
            rating for rating in self.ratings 
            if rating.to_user_id == user_id and rating.to_user_type == user_type
        ]
        
        user_ratings.sort(key=lambda x: x.created_at, reverse=True)
        return user_ratings[skip:skip + limit]
    
    async def get_rating_summary(self, user_id: str, user_type: UserType) -> RatingSummary:
        summary_key = f"{user_id}_{user_type}"
        
        if summary_key not in self.rating_summaries:
            return self._create_empty_summary(user_id, user_type)
        
        return self.rating_summaries[summary_key]
    
    async def get_recent_ratings(self, user_id: str, user_type: UserType, 
                               days: int = 30) -> List[Rating]:
        cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
        
        recent_ratings = [
            rating for rating in self.ratings
            if (rating.to_user_id == user_id and 
                rating.to_user_type == user_type and
                rating.created_at.timestamp() > cutoff_date)
        ]
        
        recent_ratings.sort(key=lambda x: x.created_at, reverse=True)
        return recent_ratings[:100]
    
    async def has_user_rated(self, from_user_id: str, to_user_id: str, 
                           transaction_id: Optional[str] = None) -> bool:
        for rating in self.ratings:
            if (rating.from_user_id == from_user_id and 
                rating.to_user_id == to_user_id):
                if transaction_id:
                    if rating.transaction_id == transaction_id:
                        return True
                else:
                    return True
        return False
    
    async def get_ratings_by_user(self, user_id: str, user_type: UserType,
                                limit: int = 20) -> List[Rating]:
        user_given_ratings = [
            rating for rating in self.ratings 
            if rating.from_user_id == user_id and rating.from_user_type == user_type
        ]
        
        user_given_ratings.sort(key=lambda x: x.created_at, reverse=True)
        return user_given_ratings[:limit]
    
    async def _update_rating_summary(self, user_id: str, user_type: UserType):
        user_ratings = [
            rating for rating in self.ratings 
            if rating.to_user_id == user_id and rating.to_user_type == user_type
        ]
        
        if not user_ratings:
            summary = self._create_empty_summary(user_id, user_type)
        else:
            total_ratings = len(user_ratings)
            total_score = sum(rating.rating for rating in user_ratings)
            average_rating = round(total_score / total_ratings, 2)
            
            rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            for rating in user_ratings:
                rating_distribution[rating.rating] += 1
            
            summary = RatingSummary(
                user_id=user_id,
                user_type=user_type,
                average_rating=average_rating,
                total_ratings=total_ratings,
                rating_distribution=rating_distribution,
                last_updated=datetime.now()
            )
        
        summary_key = f"{user_id}_{user_type}"
        self.rating_summaries[summary_key] = summary
    
    def _create_empty_summary(self, user_id: str, user_type: UserType) -> RatingSummary:
        return RatingSummary(
            user_id=user_id,
            user_type=user_type,
            average_rating=0.0,
            total_ratings=0,
            rating_distribution={1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            last_updated=datetime.now()
        )
    
    async def _find_existing_rating(self, from_user_id: str, to_user_id: str, 
                                  transaction_id: str) -> Optional[Rating]:
        for rating in self.ratings:
            if (rating.from_user_id == from_user_id and 
                rating.to_user_id == to_user_id and 
                rating.transaction_id == transaction_id):
                return rating
        return None
    
    async def export_data(self) -> str:
        data = {
            "ratings": [rating.dict() for rating in self.ratings],
            "summaries": {k: v.dict() for k, v in self.rating_summaries.items()}
        }
        return json.dumps(data, indent=2, default=str)
    
    async def import_data(self, json_data: str):
        data = json.loads(json_data)
        
        self.ratings = [Rating(**rating) for rating in data.get("ratings", [])]
        self.rating_summaries = {
            k: RatingSummary(**v) for k, v in data.get("summaries", {}).items()
        }

rating_service = RatingService()