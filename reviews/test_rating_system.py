import asyncio
from rating_models import RatingRequest, UserType
from rating_service import rating_service

async def test_rating_system():
    print("🧪 Testing Rating System")
    print("=" * 50)
    
    test_ratings = [
        RatingRequest(
            from_user_id="farmer_001",
            from_user_type=UserType.FARMER,
            to_user_id="retailer_001", 
            to_user_type=UserType.RETAILER,
            rating=5,
            transaction_id="txn_001"
        ),
        RatingRequest(
            from_user_id="farmer_001",
            from_user_type=UserType.FARMER,
            to_user_id="laborer_001",
            to_user_type=UserType.LABORER,
            rating=4,
            comment="Good work but was late sometimes",
            transaction_id="txn_002"
        ),
        RatingRequest(
            from_user_id="retailer_001",
            from_user_type=UserType.RETAILER,
            to_user_id="farmer_001",
            to_user_type=UserType.FARMER,
            rating=3,
            comment="Product quality could be better",
            transaction_id="txn_003"
        )
    ]
    
    for i, rating_request in enumerate(test_ratings, 1):
        print(f"\n{i}. Creating rating: {rating_request.from_user_type} → {rating_request.to_user_type}")
        result = await rating_service.create_rating(rating_request)
        
        if result.success:
            print(f"   ✅ Success: {result.message}")
            print(f"   ⭐ Rating: {result.rating.rating} stars")
            if result.rating.comment:
                print(f"   💬 Comment: {result.rating.comment}")
        else:
            print(f"   ❌ Error: {result.error}")
    
    print(f"\n📊 Getting ratings for farmer_001:")
    farmer_ratings = await rating_service.get_ratings_for_user("farmer_001", UserType.FARMER)
    for rating in farmer_ratings:
        print(f"   ⭐ {rating.rating} stars from {rating.from_user_type}: {rating.comment or 'No comment'}")
    
    print(f"\n📈 Rating summary for farmer_001:")
    summary = await rating_service.get_rating_summary("farmer_001", UserType.FARMER)
    print(f"   Average: {summary.average_rating} ⭐")
    print(f"   Total ratings: {summary.total_ratings}")
    print(f"   Distribution: {summary.rating_distribution}")
    
    print(f"\n🚫 Testing duplicate rating prevention:")
    duplicate_request = RatingRequest(
        from_user_id="farmer_001",
        from_user_type=UserType.FARMER,
        to_user_id="retailer_001",
        to_user_type=UserType.RETAILER,
        rating=5,
        transaction_id="txn_001"
    )
    result = await rating_service.create_rating(duplicate_request)
    print(f"   Duplicate rating result: {result.message}")
    
    print(f"\n⚡ Testing validation - rating 4 without comment:")
    invalid_request = RatingRequest(
        from_user_id="farmer_001",
        from_user_type=UserType.FARMER,
        to_user_id="retailer_002",
        to_user_type=UserType.RETAILER,
        rating=4,
        transaction_id="txn_004"
    )
    result = await rating_service.create_rating(invalid_request)
    print(f"   Validation result: {result.message}")

if __name__ == "__main__":
    asyncio.run(test_rating_system())