"""
Django settings for the Best Cars dealership review application (BFF).

The Django backend is the Backend-for-Frontend: it serves the built React SPA
and proxies API calls to the microservices (dealership-api, reviews-api,
sentiment-analyzer).
"""
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# React SPA build output (frontend/dist); Vite base="/static/" so assets are served by staticfiles.
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"

load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-django-secret-key")

DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "*").split(",") if h.strip()]

# ---------------------------------------------------------------------------
# Microservice endpoints (overridden by env in docker-compose / k8s)
# ---------------------------------------------------------------------------
DEALERSHIP_API_URL = os.getenv("DEALERSHIP_API_URL", "http://localhost:3000")
REVIEWS_API_URL = os.getenv("REVIEWS_API_URL", "http://localhost:3000")
SENTIMENT_API_URL = os.getenv("SENTIMENT_API_URL", "http://localhost:5000")
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-key-for-dev")

# ---------------------------------------------------------------------------
# Application definition
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "djangoapp",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "djangoproj.urls"

# React SPA index.html lives in frontend/dist; render it via the catch-all route.
FRONTEND_TEMPLATE_DIRS = [FRONTEND_DIST] if FRONTEND_DIST.is_dir() else []

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": FRONTEND_TEMPLATE_DIRS,
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "djangoproj.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        # DJANGO_DB_PATH lets container deployments put SQLite on a mounted volume (data survives restarts).
        "NAME": os.getenv("DJANGO_DB_PATH", str(BASE_DIR / "db.sqlite3")),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
if FRONTEND_DIST.is_dir():
    STATICFILES_DIRS.append(FRONTEND_DIST)
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# Django REST Framework + SimpleJWT
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
}

# Sign JWTs with the SHARED JWT_SECRET so reviews-api can verify them
# (simplejwt defaults to SECRET_KEY otherwise, breaking cross-service auth).
SIMPLE_JWT = {
    "SIGNING_KEY": JWT_SECRET,
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://rrobotjang.github.io",
]
CORS_ALLOW_CREDENTIALS = True
