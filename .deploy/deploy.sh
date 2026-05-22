#!/usr/bin/env bash
# M7 Life Balance — Deploy script Hostinger
# Uso: ./.deploy/deploy.sh
# Builda + sobe via rsync por SSH (chave em .deploy/hostinger_ed25519)

set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env.hostinger ]; then
  set -a
  source .env.hostinger
  set +a
fi

: "${HOSTINGER_SSH_HOST:?missing HOSTINGER_SSH_HOST}"
: "${HOSTINGER_SSH_PORT:?missing HOSTINGER_SSH_PORT}"
: "${HOSTINGER_SSH_USER:?missing HOSTINGER_SSH_USER}"
: "${HOSTINGER_DEPLOY_PATH:?missing HOSTINGER_DEPLOY_PATH}"

KEY_PATH=".deploy/hostinger_ed25519"

echo "==> Building (Vite, skip tsc)…"
npx vite build

if [ ! -f dist/.htaccess ]; then
  cp .deploy/.htaccess dist/.htaccess 2>/dev/null || true
fi

echo "==> Uploading dist/ to ${HOSTINGER_SSH_HOST}:${HOSTINGER_DEPLOY_PATH}…"
rsync -avz --delete \
  -e "ssh -i ${KEY_PATH} -p ${HOSTINGER_SSH_PORT} -o StrictHostKeyChecking=no" \
  dist/ \
  "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}:${HOSTINGER_DEPLOY_PATH}/"

echo ""
echo "✅ Deploy complete: https://${HOSTINGER_DOMAIN:-app.sistemamind7.com.br}"
