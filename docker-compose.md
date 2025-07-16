version: "3.9"
services:
  postgres:
    image: postgres:17.2
    environment:
      POSTGRES_USER: most3mr
      POSTGRES_PASSWORD: 50998577
      POSTGRES_DB: ohabits
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./ohabits_goth/db-init/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - ohabits
    deploy:
      restart_policy:
        condition: on-failure
  traefik:
    image: traefik:v3.3
    command:
      - "--configFile=/etc/traefik/traefik.yml"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
      - ./acme.json:/acme.json
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - ohabits
    deploy:
      placement:
        constraints:
          - node.role == manager
  app:
    image: apps_app:latest
    environment:
      DATABASE_URL: "postgres://most3mr:50998577@postgres:5432/ohabits?sslmode=disable"
      JWT_SECRET: "most3mr123"
    volumes:
      - ./ohabits_goth/templates:/app/templates
      - ./ohabits_goth/static:/app/static
      - ./ohabits_goth/.env:/app/.env
    networks:
      - ohabits
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    labels:
      - "traefik.enable=true"
      # HTTP router (redirects to HTTPS)
      - "traefik.http.routers.ohabits-http.rule=Host(`ohabits.most3mr.com`) || Host(`ohabits.com`)"
      - "traefik.http.routers.ohabits-http.entrypoints=web"
      - "traefik.http.routers.ohabits-http.middlewares=redirect-to-https"
      # HTTPS router
      - "traefik.http.routers.ohabits.rule=Host(`ohabits.most3mr.com`) || Host(`ohabits.com`)"
      - "traefik.http.routers.ohabits.entrypoints=websecure"
      - "traefik.http.routers.ohabits.tls=true"
      - "traefik.http.routers.ohabits.tls.certresolver=myresolver"
      - "traefik.http.services.ohabits.loadbalancer.server.port=8080"
      # Redirect middleware
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https"
      - "traefik.http.middlewares.redirect-to-https.redirectscheme.permanent=true"
  waqti:
    image: apps_waqti:latest
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: most3mr
      DB_PASSWORD: 50998577
      DB_NAME: waqti
      DB_SSLMODE: disable
      APP_ENV: production
      APP_PORT: 8080
      APP_SECRET: waqti123
      SESSION_DURATION: 720h
    volumes:
      - waqti_uploads:/app/web/static/images/upload
      - waqti_profile_uploads:/app/web/static/images/upload-profile
    networks:
      - ohabits
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
    labels:
      - "traefik.enable=true"
      # HTTP router (redirects to HTTPS)
      - "traefik.http.routers.waqti-http.rule=Host(`waqti.me`) || Host(`www.waqti.me`)"
      - "traefik.http.routers.waqti-http.entrypoints=web"
      - "traefik.http.routers.waqti-http.middlewares=redirect-to-https"
      # HTTPS router
      - "traefik.http.routers.waqti.rule=Host(`waqti.me`) || Host(`www.waqti.me`)"
      - "traefik.http.routers.waqti.entrypoints=websecure"
      - "traefik.http.routers.waqti.tls=true"
      - "traefik.http.routers.waqti.tls.certresolver=myresolver"
      - "traefik.http.services.waqti.loadbalancer.server.port=8080"
    depends_on:
      - postgres
  tinderbox:
    image: apps_tinderbox:latest
    networks:
      - ohabits
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    labels:
      - "traefik.enable=true"
      # HTTP router (redirects to HTTPS)
      - "traefik.http.routers.tinderbox-http.rule=Host(`tinderboxkw.com`) || Host(`www.tinderboxkw.com`)"
      - "traefik.http.routers.tinderbox-http.entrypoints=web"
      - "traefik.http.routers.tinderbox-http.middlewares=redirect-to-https"
      # HTTPS router
      - "traefik.http.routers.tinderbox.rule=Host(`tinderboxkw.com`) || Host(`www.tinderboxkw.com`)"
      - "traefik.http.routers.tinderbox.entrypoints=websecure"
      - "traefik.http.routers.tinderbox.tls=true"
      - "traefik.http.routers.tinderbox.tls.certresolver=myresolver"
      - "traefik.http.services.tinderbox.loadbalancer.server.port=8080"
  moalemplus:
    image: apps_moalemplus:latest
    networks:
      - ohabits
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    labels:
      - "traefik.enable=true"
      # HTTP router (redirects to HTTPS)
      - "traefik.http.routers.moalemplus-http.rule=Host(`moalem.plus`) || Host(`www.moalem.plus`)"
      - "traefik.http.routers.moalemplus-http.entrypoints=web"
      - "traefik.http.routers.moalemplus-http.middlewares=redirect-to-https"
      # HTTPS router
      - "traefik.http.routers.moalemplus.rule=Host(`moalem.plus`) || Host(`www.moalem.plus`)"
      - "traefik.http.routers.moalemplus.entrypoints=websecure"
      - "traefik.http.routers.moalemplus.tls=true"
      - "traefik.http.routers.moalemplus.tls.certresolver=myresolver"
      - "traefik.http.services.moalemplus.loadbalancer.server.port=3000"
networks:
  ohabits:
    driver: overlay
volumes:
  postgres_data:
  waqti_uploads:
  waqti_profile_uploads:
