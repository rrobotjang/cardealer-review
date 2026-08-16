# Best Cars — Car Dealership Review Application

Full-stack cloud-native dealership review application following the **IBM Full Stack
Developer Professional Certificate** capstone architecture.

## Architecture

```
Browser ──► React SPA (frontend/, Vite + React + TypeScript, Bootstrap 5)
                 │  (served by Django at /, API via /api)
                 ▼
          Django BFF (backend, :8000) ──┬─► dealership-api (Express, :3000, static JSON catalog)
          (DRF + JWT auth)              ├─► reviews-api (Express + MongoDB, :3000, JWT-protected)
                                        └─► sentiment-analyzer (Express, :5000, serverless on IBM Code Engine)
```

- **React SPA** (`frontend/`) — Vite + React + TypeScript + Bootstrap 5 UI
  (home, dealerships, dealer details + reviews, post-review, about, contact, auth modal).
  Built with `base="/static/"`, so the compiled bundle is served by Django.
- **Django BFF** (`backend/`) — serves the built SPA (`frontend/dist`) and proxies all API calls.
  Handles registration/login, issues JWTs (signed with the shared `JWT_SECRET`).
- **dealership-api** (`dealership-api/`) — read-only dealership catalog.
- **reviews-api** (`reviews-api/`) — reviews stored in MongoDB; `POST /review` requires
  a valid Bearer JWT issued by the Django BFF.
- **sentiment-analyzer** (`sentiment-analyzer/`) — stateless `POST /analyze`
  microservice (AFINN-165 word list), designed to run **serverless on IBM Code Engine**
  (scale-to-zero).

## Project layout

```
backend/               Django BFF (settings, djangoapp with DRF views, serves built SPA)
frontend/              React SPA (Vite + React + TypeScript, Bootstrap 5)
dealership-api/        Express microservice + data/dealerships.json
reviews-api/           Express + Mongoose microservice + JWT middleware
sentiment-analyzer/    Serverless sentiment microservice + codeengine.md deploy guide
k8s/                   Kubernetes / OpenShift manifests (namespace, mongo, 4 services, secret)
docker-compose.yml     Local one-command environment
```

## Quick start (Docker)

```bash
docker compose up --build
# backend      -> http://localhost:8000
# dealerships  -> http://localhost:3000/dealerships
# reviews-api  -> http://localhost:3001 (host) / reviews-api:3000 (internal)
# sentiment    -> http://localhost:5000
```

The Django BFF containers talk to services by Compose name (`dealership-api:3000`, etc.).

## Local development (no Docker)

Prerequisites: Node 24+, Python 3.12+, local MongoDB (or adjust `MONGO_URL`).

```bash
# 1. Microservices
cd dealership-api  && npm install && npm start        # :3000
cd reviews-api     && npm install && npm start        # :3000
cd sentiment-analyzer && npm install && npm start     # :5000

# 2. React SPA (dev server, proxies /api to Django :8000)
cd frontend && npm install && npm run dev             # http://localhost:5173

# 3. Django BFF
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp .env.example .env        # point URLs at your local services
.venv/bin/python manage.py makemigrations djangoapp
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver 0.0.0.0:8000
```

> **Production-style local run:** `cd frontend && npm run build`, then Django serves
> the built SPA directly at `http://localhost:8000` (index.html from `frontend/dist`,
> assets from `/static/assets/*`).

> The three Express services all default to the same `PORT=3000`. For local testing run
> them on separate ports (`PORT=3001 npm start`, etc.) and point `.env` accordingly.

## API surface

| Endpoint (via Django BFF) | Method | Auth | Description |
|---|---|---|---|
| `/api/dealerships` | GET | – | List dealerships (proxied to dealership-api) |
| `/api/dealerships/<id>/` | GET | – | Dealership detail |
| `/api/dealer/<id>/reviews` | GET | – | Reviews for a dealer (proxied to reviews-api) |
| `/api/dealer/<id>/review` | POST | Bearer JWT | Add review; sentiment auto-computed, proxied to reviews-api |
| `/api/register` | POST | – | Create user, returns JWT pair |
| `/api/login` | POST | – | JWT pair |
| `/api/sentiment` | POST | – | `{text}` → `{sentiment}` (proxied to sentiment-analyzer) |
| `/api/carmakes` | GET | – | Reference car makes |

## Deployment

### 1. IBM Code Engine — sentiment-analyzer (serverless)

See [sentiment-analyzer/codeengine.md](sentiment-analyzer/codeengine.md) for the full
guide: push image to IBM Container Registry, then

```bash
ibmcloud ce application create --name sentiment-analyzer \
  --image <region>.icr.io/<ns>/sentiment-analyzer:latest \
  --port 5000 --min-scale 0 --max-scale 1
```

Set `SENTIMENT_API_URL=https://sentiment-analyzer.<project>.<region>.codeengine.appdomain.cloud`
in the backend's environment.

### 2. Kubernetes / OpenShift

```bash
# build & push images to your registry (replace <REGISTRY> in the manifests)
# backend image is built from the repo root (multi-stage: builds the SPA first)
docker build -f backend/Dockerfile -t <REGISTRY>/backend:latest .
docker build -t <REGISTRY>/dealership-api:latest dealership-api
docker build -t <REGISTRY>/reviews-api:latest reviews-api
docker build -t <REGISTRY>/sentiment-analyzer:latest sentiment-analyzer

# apply manifests
kubectl apply -f k8s/            # or: oc apply -f k8s/
kubectl -n cardealer get pods

# expose the backend (OpenShift)
oc expose svc/backend --name bestcars -n cardealer
```

Replace `<REGISTRY>` in `k8s/*.yaml` with your image registry, and change the dev
`jwt-secret` (`k8s/05-secret.yaml`) in production.

### 3. Cloud Foundry

Each microservice ships a `manifest.yml`:

```bash
cd dealership-api && ibmcloud cf push
cd reviews-api    && ibmcloud cf push
cd sentiment-analyzer && ibmcloud cf push
```

> Reviews stored in MongoDB: point `MONGO_URL` at IBM Cloud Databases for MongoDB in
> production.

## Environment variables (backend)

| Variable | Default | Purpose |
|---|---|---|
| `DJANGO_SECRET_KEY` | dev value | Django secret — change in production |
| `DEBUG` | `True` | Django debug mode |
| `ALLOWED_HOSTS` | `*` | Comma-separated hosts |
| `DEALERSHIP_API_URL` | `http://localhost:3000` | dealership-api base URL |
| `REVIEWS_API_URL` | `http://localhost:3000` | reviews-api base URL |
| `SENTIMENT_API_URL` | `http://localhost:5000` | sentiment-analyzer base URL |
| `JWT_SECRET` | dev value | Shared signing key across BFF + reviews-api — must match |

## Security notes

- `JWT_SECRET` is shared by the Django BFF (signing) and reviews-api (verification).
  Generate a strong secret in production (`openssl rand -hex 64`) and inject it via
  secrets, not the manifests.
- Review POSTing requires authentication; reviews-api independently verifies the token.
- Sentiment analysis failure degrades gracefully to `neutral` so review posting never breaks.
