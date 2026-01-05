#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

COMMIT=$(git rev-parse --short HEAD)
IMAGE="quench:${COMMIT}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Building Docker image: ${IMAGE}"

docker build -t "${IMAGE}" -t "quench:latest" .

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Build complete: ${IMAGE}"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Tagged as: quench:latest"
