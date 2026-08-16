#!/bin/sh
# Best Cars — one-command local dev stack.
# Starts the three microservices + Django BFF (no Docker required).
set -e
cd "$(dirname "$0")"

if ! pgrep -q mongod; then
  echo "Starting mongod (brew service)..."
  brew services start mongodb-community
  sleep 3
fi

detach() {
  cwd="$1"; log="$2"; shift 2
  python3 - "$cwd" "$log" "$@" <<'PYEOF'
import subprocess, sys
cwd, log = sys.argv[1], sys.argv[2]
cmd = sys.argv[3:]
with open(log, "a") as f:
    subprocess.Popen(cmd, cwd=cwd, stdout=f, stderr=subprocess.STDOUT,
                     stdin=subprocess.DEVNULL, start_new_session=True)
PYEOF
}

echo "Starting dealership-api on :3000 ..."
detach "$PWD/dealership-api" /tmp/bestcars-dealership.log sh -c "exec node server.js"

echo "Starting reviews-api on :3001 ..."
detach "$PWD/reviews-api" /tmp/bestcars-reviews.log sh -c "exec env PORT=3001 MONGO_URL=mongodb://localhost:27017/reviews JWT_SECRET=super-secret-key-for-dev node server.js"

echo "Starting sentiment-analyzer on :5003 ..."
detach "$PWD/sentiment-analyzer" /tmp/bestcars-sentiment.log sh -c "exec env PORT=5003 node server.js"

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env from .env.example"
fi

echo "Starting Django BFF on :8000 ..."
detach "$PWD/backend" /tmp/bestcars-django.log sh -c "exec .venv/bin/python manage.py runserver 127.0.0.1:8000 --noreload"

sleep 3
echo
echo "Best Cars is running at http://127.0.0.1:8000"
echo "Stop everything with: pkill -f 'server.js|manage.py runserver'"
