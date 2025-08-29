from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import asyncio

from app.core.config import settings
from app.routers import movies
from app.websocket.manager import manager
from app.services.tmdb_service import tmdb_service

# Background task to update trending movies every hour
async def update_trending_movies():
    while True:
        try:
            print("Updating trending movies...")
            trending_movies = await tmdb_service.get_trending_movies()
            
            await manager.broadcast(json.dumps({
                "type": "trending_update",
                "data": trending_movies
            }))
            
            # Wait 1 hour before next update
            await asyncio.sleep(3600)
            
        except Exception as e:
            print(f"Error in background update: {e}")
            # Wait 5 minutes before retrying on error
            await asyncio.sleep(300)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start background tasks when app starts
    print("Starting Movie Recommender API...")
    
    # Start background trending update task
    asyncio.create_task(update_trending_movies())
    
    yield
    
    # Cleanup when app shuts down
    print("Shutting down Movie Recommender API...")

# Create FastAPI app
app = FastAPI(
    title="Real-Time Movie Recommender API",
    description="A real-time movie recommendation system using TMDB API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies.router)

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            # Wait for messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "get_recommendations":
                movie_id = message["movie_id"]
                recommendations = await tmdb_service.get_movie_recommendations(movie_id)
                await websocket.send_text(json.dumps({
                    "type": "recommendations",
                    "movie_id": movie_id,
                    "data": recommendations
                }))
            
            elif message["type"] == "search":
                query = message["query"]
                results = await tmdb_service.search_movies(query)
                await websocket.send_text(json.dumps({
                    "type": "search_results",
                    "query": query,
                    "data": results
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client {client_id} disconnected")

# Basic endpoints
@app.get("/")
async def root():
    return {
        "message": "Real-Time Movie Recommender API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
