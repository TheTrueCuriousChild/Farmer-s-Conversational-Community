from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rating_routes import router as rating_router
import uvicorn

app = FastAPI(
    title="Farmer AI Rating System",
    description="Rating system for Farmers, Retailers, and Laborers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rating_router)

@app.get("/")
async def root():
    return {
        "message": "Farmer AI Rating System API is running!",
        "version": "1.0.0",
        "endpoints": {
            "create_rating": "POST /api/ratings/",
            "get_user_ratings": "GET /api/ratings/user/{user_id}/{user_type}",
            "get_rating_summary": "GET /api/ratings/summary/{user_id}/{user_type}",
            "get_recent_ratings": "GET /api/ratings/recent/{user_id}/{user_type}",
            "check_rating": "GET /api/ratings/check-rating/{from_user_id}/{to_user_id}"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "rating-system"}

if __name__ == "__main__":
    print("🚀 Starting Farmer AI Rating System Server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("🔧 Press CTRL+C to stop the server")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
