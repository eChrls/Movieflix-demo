# MovieFlix Demo - Instalacion Segura (Docker)

Este documento sustituye la guia legacy (backend + base de datos local).

Estado actual del proyecto:

- Demo estatica.
- Persistencia en LocalStorage del navegador.
- Sin backend en runtime.
- Sin base de datos.

## Requisitos

- Docker
- Docker Compose
- Acceso a un proxy TLS (por ejemplo Traefik) o puertos locales para pruebas

## Despliegue rapido

```bash
cd <ruta-del-proyecto>/MovieFlix-demo
chmod +x deploy/deploy-orangepi.sh
./deploy/deploy-orangepi.sh
```

## DNS (DuckDNS) opcional

No guardes tokens en repositorio.

```bash
cd <ruta-del-proyecto>/MovieFlix-demo/deploy
export DUCKDNS_TOKEN="<token>"
export DUCKDNS_DOMAIN="movie-demo"
export DUCKDNS_IP="<ip-publica-del-servidor>"
./duckdns-update-movie-demo.sh
```

## Verificacion

```bash
cd <ruta-del-proyecto>/MovieFlix-demo
docker compose ps
curl -I https://movie-demo.duckdns.org
```

## Seguridad minima recomendada

- Mantener el token de DuckDNS fuera de Git.
- Usar filesystem read-only en el contenedor (ya configurado en compose).
- Revisar cabeceras de seguridad desde el proxy.
- No incluir credenciales reales en documentacion ni ejemplos.

## Referencias

- Guia operativa: deploy/ORANGEPI-DEPLOY.md
- Arranque principal del proyecto: README.md
