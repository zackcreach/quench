#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

IMAGE="${1:-quench:latest}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Deploying ${IMAGE}..."

log "Running database migrations..."
docker compose -f docker-compose.yml run --rm quench /app/bin/migrate

log "Stopping old containers..."
docker compose -f docker-compose.yml down

log "Starting new containers..."
docker compose -f docker-compose.yml up -d

log "Waiting for health check..."
sleep 5

if docker ps | grep -q quench; then
  log "Deployment successful!"
  log "Container is running"
  docker compose -f docker-compose.yml ps
else
  log "ERROR: Deployment failed!"
  log "Container logs:"
  docker compose -f docker-compose.yml logs quench
  exit 1
fi
