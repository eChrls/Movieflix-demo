# Despliegue seguro en Orange Pi (Docker + Traefik)

Este proyecto queda desplegado como web estatica (sin backend, sin base de datos, sin APIs externas).

## 1. Pre-checks de seguridad

1. Verificar estado del host:

```bash
/home/casa74b/scripts/health-check.sh
sudo ufw status verbose
sudo fail2ban-client status sshd
```

2. Verificar red de Traefik:

```bash
docker network inspect traefik-public >/dev/null
```

3. Backup rapido de configuracion de Traefik:

```bash
cp /mnt/data/docker/traefik/docker-compose.yml /mnt/data/backups/traefik-compose-$(date +%F-%H%M).yml
```

## 2. Publicar DNS en DuckDNS

No guardar el token en el repositorio.

```bash
cd /mnt/data/www/MovieFlix-demo/deploy
chmod +x duckdns-update-movie-demo.sh
export DUCKDNS_TOKEN="<token-duckdns-account1>"
export DUCKDNS_DOMAIN="movie-demo"
export DUCKDNS_IP="80.102.148.90"
./duckdns-update-movie-demo.sh
```

Validar resolucion:

```bash
dig +short movie-demo.duckdns.org
```

Debe devolver `80.102.148.90`.

## 3. Deploy del stack

```bash
cd /mnt/data/www/MovieFlix-demo
chmod +x deploy/deploy-orangepi.sh
./deploy/deploy-orangepi.sh
```

## 4. Verificacion HTTPS y routing

```bash
docker ps | grep movie-demo
docker logs traefik --tail 100 | grep movie-demo
curl -I https://movie-demo.duckdns.org
```

## 5. Post-deploy hardening

1. Confirmar que no hay endpoints API activos para esta app.
2. Confirmar cabeceras de seguridad:

```bash
curl -I https://movie-demo.duckdns.org | egrep -i "x-frame-options|x-content-type-options|referrer-policy|permissions-policy"
```

3. Revisar logs:

```bash
docker compose logs --tail 100
cat /mnt/data/docker/traefik/logs/access.log | tail -50
```

## 6. Rollback rapido

```bash
cd /mnt/data/www/MovieFlix-demo
docker compose down
```
