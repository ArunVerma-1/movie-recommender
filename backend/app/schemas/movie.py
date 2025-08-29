from pydantic import BaseModel
from typing import List, Optional

class Genre(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None

class Movie(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    release_date: Optional[str] = None
    genre_ids: List[int] = []
    popularity: Optional[float] = None

class MovieSearchResponse(BaseModel):
    page: int
    results: List[Movie]
    total_pages: int
    total_results: int

class RecommendationRequest(BaseModel):
    movie_id: int
