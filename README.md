# MovieFlix Demo

MovieFlix Demo es una aplicacion web estilo IMDb para explorar un catalogo de peliculas y series.

Estado actual del proyecto:

- Frontend React con datos persistidos solo en LocalStorage.
- Sin API externa en tiempo de ejecucion.
- Sin base de datos.
- Despliegue estatico con Docker + Nginx + Traefik.

## Objetivo

Proveer una demo funcional, usable y portable para portfolio tecnico, centrada en:

- Navegacion por catalogo.
- Fichas de detalle.
- Busqueda y filtros.
- Lista personal (pendiente/visto) persistida en navegador.

## Arquitectura

- Frontend: React (CRA), rutas con react-router.
- Persistencia: LocalStorage (catalogo, perfil actual, lista vista).
- Runtime de produccion: Nginx sirviendo build estatico.
- Reverse proxy: Traefik (SSL, routing por host).

No se requiere backend para funcionar.

## Estructura

```
MovieFlix-demo/
  frontend/
    src/
    public/
  deploy/
    nginx.conf
    deploy-orangepi.sh
    duckdns-update-movie-demo.sh
    ORANGEPI-DEPLOY.md
  Dockerfile
  docker-compose.yml
```

## Desarrollo local

Requisitos:

- Node.js 18+
- npm

Comandos:

```bash
cd frontend
npm install
npm start
```

App en local:

- http://localhost:3000

## Build de produccion

```bash
cd frontend
npm run build
```

## Despliegue Docker en Orange Pi

Se usa un unico contenedor estatico (sin backend).

```bash
cd <ruta-del-proyecto>/MovieFlix-demo
chmod +x deploy/deploy-orangepi.sh
./deploy/deploy-orangepi.sh
```

La guia completa esta en:

- deploy/ORANGEPI-DEPLOY.md

## DNS DuckDNS (movie-demo)

Script incluido:

- deploy/duckdns-update-movie-demo.sh

Uso recomendado (sin guardar token en repo):

```bash
cd <ruta-del-proyecto>/MovieFlix-demo/deploy
export DUCKDNS_TOKEN="<token>"
export DUCKDNS_DOMAIN="movie-demo"
export DUCKDNS_IP="<ip-publica-del-servidor>"
./duckdns-update-movie-demo.sh
```

## Seguridad

Controles aplicados en despliegue:

- Contenedor en red `traefik-public` con TLS por Traefik.
- Middleware `security-headers@file` en router.
- Root filesystem en solo lectura en `docker-compose.yml`.
- `tmpfs` para rutas de escritura temporales de Nginx.
- Sin secretos en frontend.
- Sin consumo de APIs externas desde cliente.

## Notas

- Si hay datos corruptos en navegador, limpiar LocalStorage y recargar.
- Para rollback rapido: `docker compose down`.

## Licencia

MIT
