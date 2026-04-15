#!/usr/bin/env bash
set -euo pipefail

# Required env vars:
# DUCKDNS_TOKEN
# Optional:
# DUCKDNS_DOMAIN (default: movie-demo)
# DUCKDNS_IP (default: auto detect by DuckDNS)

DOMAIN="${DUCKDNS_DOMAIN:-movie-demo}"
TOKEN="${DUCKDNS_TOKEN:-}"
IP="${DUCKDNS_IP:-}"

if [[ -z "$TOKEN" ]]; then
  echo "DUCKDNS_TOKEN no definido"
  exit 1
fi

URL="https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&verbose=true"
if [[ -n "$IP" ]]; then
  URL+="&ip=${IP}"
fi

RESPONSE=$(curl -fsS "$URL")
echo "$RESPONSE"

if [[ "$RESPONSE" != OK* ]]; then
  echo "Error actualizando DuckDNS"
  exit 1
fi
