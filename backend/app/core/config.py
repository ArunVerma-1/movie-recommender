from decouple import config

class Settings:
    TMDB_API_KEY: str = config('TMDB_API_KEY')
    TMDB_BASE_URL: str = config('TMDB_BASE_URL', default='https://api.themoviedb.org/3')
    SECRET_KEY: str = config('SECRET_KEY')
    CORS_ORIGINS: list = config('CORS_ORIGINS', cast=lambda x: x.strip('[]').replace('"', '').split(', '))

settings = Settings()
