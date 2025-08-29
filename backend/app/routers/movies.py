from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.schemas.movie import Movie, MovieSearchResponse, RecommendationRequest
from app.services.tmdb_service import tmdb_service

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("/trending", response_model=List[Movie])
async def get_trending_movies(time_window: str = Query(default="day", regex="^(day|week)$")):
    """Get trending movies - updates in real-time from TMDB"""
    try:
        movies_data = await tmdb_service.get_trending_movies(time_window)
        movies = [Movie(**movie) for movie in movies_data]
        return movies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending movies: {str(e)}")

@router.get("/popular", response_model=List[Movie])
async def get_popular_movies():
    """Get popular movies from TMDB"""
    try:
        movies_data = await tmdb_service.get_popular_movies()
        movies = [Movie(**movie) for movie in movies_data]
        return movies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching popular movies: {str(e)}")

@router.get("/upcoming", response_model=List[Movie])
async def get_upcoming_movies():
    """Get upcoming movies from TMDB"""
    try:
        movies_data = await tmdb_service.get_upcoming_movies()
        movies = [Movie(**movie) for movie in movies_data]
        return movies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching upcoming movies: {str(e)}")

@router.get("/top-rated", response_model=List[Movie])
async def get_top_rated_movies():
    """Get top rated movies from TMDB"""
    try:
        movies_data = await tmdb_service.get_top_rated_movies()
        movies = [Movie(**movie) for movie in movies_data]
        return movies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top rated movies: {str(e)}")

@router.get("/now-playing", response_model=List[Movie])
async def get_now_playing_movies():
    """Get now playing movies from TMDB"""
    try:
        movies_data = await tmdb_service.get_now_playing_movies()
        movies = [Movie(**movie) for movie in movies_data]
        return movies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching now playing movies: {str(e)}")

@router.get("/search")
async def search_movies(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(default=1, ge=1, le=1000, description="Page number"),
    include_adult: bool = Query(default=False, description="Include adult content")
):
    """Search movies in real-time with pagination"""
    try:
        movies_data = await tmdb_service.search_movies(q, page, include_adult)
        movies = [Movie(**movie) for movie in movies_data.get('results', [])]
        
        return {
            "results": movies,
            "page": movies_data.get('page', 1),
            "total_pages": movies_data.get('total_pages', 1),
            "total_results": movies_data.get('total_results', 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")

@router.get("/discover")
async def discover_movies(
    with_genres: str = Query(default=None, description="Comma-separated genre IDs"),
    sort_by: str = Query(default="popularity.desc", description="Sort results by field"),
    year: int = Query(default=None, description="Release year"),
    vote_average_gte: float = Query(default=None, ge=0, le=10, description="Minimum rating"),
    page: int = Query(default=1, ge=1, le=1000, description="Page number")
):
    """Discover movies with filters"""
    try:
        movies_data = await tmdb_service.discover_movies(
            with_genres=with_genres,
            sort_by=sort_by,
            year=year,
            vote_average_gte=vote_average_gte,
            page=page
        )
        movies = [Movie(**movie) for movie in movies_data.get('results', [])]
        
        return {
            "results": movies,
            "page": movies_data.get('page', 1),
            "total_pages": movies_data.get('total_pages', 1),
            "total_results": movies_data.get('total_results', 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error discovering movies: {str(e)}")

@router.get("/{movie_id}")
async def get_movie_details(movie_id: int):
    """Get detailed movie information including genres, production companies, etc."""
    try:
        movie_data = await tmdb_service.get_movie_details(movie_id)
        if not movie_data:
            raise HTTPException(status_code=404, detail="Movie not found")
        return movie_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie details: {str(e)}")

@router.get("/{movie_id}/videos")
async def get_movie_videos(movie_id: int):
    """Get movie videos (trailers, teasers, clips, etc.)"""
    try:
        videos = await tmdb_service.get_movie_videos(movie_id)
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie videos: {str(e)}")

@router.get("/{movie_id}/credits")
async def get_movie_credits(movie_id: int):
    """Get movie cast and crew information"""
    try:
        credits = await tmdb_service.get_movie_credits(movie_id)
        return credits
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie credits: {str(e)}")

@router.get("/{movie_id}/images")
async def get_movie_images(movie_id: int):
    """Get movie images (posters, backdrops, logos)"""
    try:
        images = await tmdb_service.get_movie_images(movie_id)
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie images: {str(e)}")

@router.get("/{movie_id}/reviews")
async def get_movie_reviews(
    movie_id: int,
    page: int = Query(default=1, ge=1, le=1000, description="Page number")
):
    """Get movie reviews from TMDB users"""
    try:
        reviews = await tmdb_service.get_movie_reviews(movie_id, page)
        return reviews
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie reviews: {str(e)}")

@router.get("/{movie_id}/similar")
async def get_similar_movies(
    movie_id: int,
    page: int = Query(default=1, ge=1, le=1000, description="Page number")
):
    """Get movies similar to the given movie"""
    try:
        movies_data = await tmdb_service.get_similar_movies(movie_id, page)
        movies = [Movie(**movie) for movie in movies_data.get('results', [])]
        
        return {
            "results": movies,
            "page": movies_data.get('page', 1),
            "total_pages": movies_data.get('total_pages', 1),
            "total_results": movies_data.get('total_results', 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching similar movies: {str(e)}")

@router.post("/recommendations")
async def get_movie_recommendations(request: RecommendationRequest):
    """Get movie recommendations based on a given movie"""
    try:
        recommendations_data = await tmdb_service.get_movie_recommendations(request.movie_id)
        recommendations = [Movie(**movie) for movie in recommendations_data]
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recommendations: {str(e)}")

@router.get("/genres/list")
async def get_movie_genres():
    """Get list of all movie genres"""
    try:
        genres = await tmdb_service.get_movie_genres()
        return genres
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie genres: {str(e)}")

@router.get("/person/{person_id}")
async def get_person_details(person_id: int):
    """Get details about a person (actor, director, etc.)"""
    try:
        person_data = await tmdb_service.get_person_details(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail="Person not found")
        return person_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching person details: {str(e)}")

@router.get("/person/{person_id}/movie_credits")
async def get_person_movie_credits(person_id: int):
    """Get movie credits for a person"""
    try:
        credits = await tmdb_service.get_person_movie_credits(person_id)
        return credits
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching person movie credits: {str(e)}")

# Additional utility endpoints
@router.get("/configuration")
async def get_tmdb_configuration():
    """Get TMDB API configuration (image base URLs, sizes, etc.)"""
    try:
        config = await tmdb_service.get_configuration()
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching configuration: {str(e)}")

@router.get("/trending/person/{time_window}")
async def get_trending_people(time_window: str = Query(default="day", regex="^(day|week)$")):
    """Get trending people (actors, directors, etc.)"""
    try:
        people_data = await tmdb_service.get_trending_people(time_window)
        return people_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending people: {str(e)}")

@router.get("/collection/{collection_id}")
async def get_movie_collection(collection_id: int):
    """Get details about a movie collection"""
    try:
        collection_data = await tmdb_service.get_movie_collection(collection_id)
        if not collection_data:
            raise HTTPException(status_code=404, detail="Collection not found")
        return collection_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie collection: {str(e)}")

# Health check endpoint for this router
@router.get("/health")
async def movies_health_check():
    """Health check for movies router"""
    return {
        "status": "healthy",
        "service": "movies",
        "endpoints": [
            "trending", "popular", "upcoming", "top-rated", "now-playing",
            "search", "discover", "genres", "configuration"
        ]
    }