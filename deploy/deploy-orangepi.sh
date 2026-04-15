#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/mnt/data/www/MovieFlix-demo"
STACK_NAME="movie-demo"

cd "$APP_DIR"

# Pre-checks
command -v docker >/dev/null 2>&1 || { echo "docker no disponible"; exit 1; }
docker network inspect traefik-public >/dev/null 2>&1 || {
  echo "La red traefik-public no existe";
  exit 1;
}

# Build and deploy
docker compose build --no-cache
docker compose up -d

# Basic validation
docker ps --filter name="$STACK_NAME"
docker compose logs --tail=80
