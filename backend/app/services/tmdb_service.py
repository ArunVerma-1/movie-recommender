import httpx
from typing import List, Dict
from app.core.config import settings

class TMDBService:
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        print(f"Initializing TMDB Service with API key: {self.api_key[:8]}...")

    async def get_trending_movies(self, time_window: str = "day") -> List[Dict]:
        url = f"{self.base_url}/trending/movie/{time_window}"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_trending_movies: {e}")
                return []

    async def get_popular_movies(self) -> List[Dict]:
        url = f"{self.base_url}/movie/popular"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_popular_movies: {e}")
                return []

    async def get_upcoming_movies(self) -> List[Dict]:
        url = f"{self.base_url}/movie/upcoming"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_upcoming_movies: {e}")
                return []

    async def get_top_rated_movies(self) -> List[Dict]:
        url = f"{self.base_url}/movie/top_rated"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_top_rated_movies: {e}")
                return []

    async def get_now_playing_movies(self) -> List[Dict]:
        url = f"{self.base_url}/movie/now_playing"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_now_playing_movies: {e}")
                return []

    async def search_movies(self, query: str, page: int = 1, include_adult: bool = False) -> Dict:
        url = f"{self.base_url}/search/movie"
        params = {
            "api_key": self.api_key,
            "query": query,
            "page": page,
            "include_adult": include_adult
        }
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in search_movies: {e}")
                return {"results": [], "page": page, "total_pages": 0, "total_results": 0}

    async def discover_movies(self, **filters) -> Dict:
        url = f"{self.base_url}/discover/movie"
        params = {"api_key": self.api_key}
        # Map our filter keys to TMDB API params
        if filters.get("with_genres"):
            params["with_genres"] = filters["with_genres"]
        if filters.get("sort_by"):
            params["sort_by"] = filters["sort_by"]
        if filters.get("year"):
            params["year"] = filters["year"]
        if filters.get("vote_average_gte"):
            params["vote_average.gte"] = filters["vote_average_gte"]
        if filters.get("page"):
            params["page"] = filters["page"]
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in discover_movies: {e}")
                return {"results": [], "page": 1, "total_pages": 0, "total_results": 0}

    async def get_movie_details(self, movie_id: int) -> Dict:
        url = f"{self.base_url}/movie/{movie_id}"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_movie_details: {e}")
                return {}

    async def get_movie_videos(self, movie_id: int) -> List[Dict]:
        url = f"{self.base_url}/movie/{movie_id}/videos"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_movie_videos: {e}")
                return []

    async def get_movie_credits(self, movie_id: int) -> Dict:
        url = f"{self.base_url}/movie/{movie_id}/credits"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_movie_credits: {e}")
                return {"cast": [], "crew": []}

    async def get_movie_images(self, movie_id: int) -> Dict:
        url = f"{self.base_url}/movie/{movie_id}/images"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_movie_images: {e}")
                return {"backdrops": [], "posters": [], "logos": []}

    async def get_movie_reviews(self, movie_id: int, page: int = 1) -> Dict:
        url = f"{self.base_url}/movie/{movie_id}/reviews"
        params = {"api_key": self.api_key, "page": page}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_movie_reviews: {e}")
                return {"results": [], "page": page, "total_pages": 0, "total_results": 0}

    async def get_similar_movies(self, movie_id: int, page: int = 1) -> Dict:
        url = f"{self.base_url}/movie/{movie_id}/similar"
        params = {"api_key": self.api_key, "page": page}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_similar_movies: {e}")
                return {"results": [], "page": page, "total_pages": 0, "total_results": 0}

    async def get_movie_recommendations(self, movie_id: int) -> List[Dict]:
        url = f"{self.base_url}/movie/{movie_id}/recommendations"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_movie_recommendations: {e}")
                return []

    async def get_movie_genres(self) -> List[Dict]:
        url = f"{self.base_url}/genre/movie/list"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("genres", [])
            except Exception as e:
                print(f"Error in get_movie_genres: {e}")
                return []

    async def get_person_details(self, person_id: int) -> Dict:
        url = f"{self.base_url}/person/{person_id}"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_person_details: {e}")
                return {}

    async def get_person_movie_credits(self, person_id: int) -> Dict:
        url = f"{self.base_url}/person/{person_id}/movie_credits"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_person_movie_credits: {e}")
                return {}

    async def get_configuration(self) -> Dict:
        url = f"{self.base_url}/configuration"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_configuration: {e}")
                return {}

    async def get_trending_people(self, time_window: str = "day") -> List[Dict]:
        url = f"{self.base_url}/trending/person/{time_window}"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json().get("results", [])
            except Exception as e:
                print(f"Error in get_trending_people: {e}")
                return []

    async def get_movie_collection(self, collection_id: int) -> Dict:
        url = f"{self.base_url}/collection/{collection_id}"
        params = {"api_key": self.api_key}
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                print(f"Error in get_movie_collection: {e}")
                return {}

tmdb_service = TMDBService()