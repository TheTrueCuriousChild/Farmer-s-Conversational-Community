print("🔍 Checking all imports...")

try:
    from rating_models import Rating, RatingSummary, RatingRequest, RatingResponse, UserType
    print("✅ rating_models imports successful")
except ImportError as e:
    print(f"❌ rating_models import failed: {e}")

try:
    from rating_service import rating_service
    print("✅ rating_service import successful")
except ImportError as e:
    print(f"❌ rating_service import failed: {e}")

try:
    from rating_routes import router
    print("✅ rating_routes import successful")
except ImportError as e:
    print(f"❌ rating_routes import failed: {e}")

print("Import check completed!")