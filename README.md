# Genak: NestJS Microservices Architecture

Genak is the backend of a multi-vendor ordering platform (customers, vendors and admins), built as a **microservices system in NestJS**. It is a personal architecture project: I built it to design, implement and run a realistic distributed backend end to end. It is not deployed in production.

## Architecture at a glance

```
                    ┌──────────────┐
  Clients  ───────▶ │    Nginx     │  reverse proxy: one public entry point,
 (mobile / web)     │  (port 80)   │  routes /genak-<service>/api/v1 to each service
                    └──────┬───────┘
                           │ HTTP (REST, URI-versioned)
     ┌──────────┬──────────┼──────────┬──────────┬─────────┐
     ▼          ▼          ▼          ▼          ▼         ▼
   auth     customers   vendors    orders   products   … (19 services)
     │          │          │          │          │         │
     └──────────┴──────────┴────┬─────┴──────────┴─────────┘
                                │ RPC + events (one queue per service)
                         ┌──────▼──────┐
                         │  RabbitMQ   │
                         └─────────────┘
```

- **19 NestJS applications** in one monorepo, **17 of them connected over RabbitMQ**, each with its own queue.
- Every service exposes **two interfaces**:
  - **HTTP**: versioned REST endpoints (`/api/v1`), split by audience (`customer`, `vendor`, `admin`).
  - **RPC**: message handlers that other services call through RabbitMQ (**50 request/response message patterns**, plus fire-and-forget events that the `notifications` service consumes for push, SMS and in-app notifications).
- **Nginx** acts as the single public entry point and routes each path prefix to the right container.
- **Docker**: each service has its own Dockerfile; `docker-compose.yml` starts all services together with RabbitMQ and Nginx.

## Services

| Domain | Services |
|---|---|
| Identity and users | `auth`, `customers`, `vendors`, `admins`, `profile` |
| Commerce | `products`, `orders`, `reviews`, `complains`, `reasons` |
| Content and files | `attachments`, `documents`, `storage`, `on-boarding-screens` |
| Platform | `notifications` (Firebase push), `locations`, `settings`, `reports`, `main` |

## Shared library (`libs/common`)

Code that every service needs lives in one shared library instead of being copied:

- **Typed microservice clients**: one client per service, so calling another service is a typed method, not a raw queue message.
- **Authentication**: JWT auth guard and custom decorators.
- **Serialisation interceptor**: DTO-based responses, so internal fields never leak to clients.
- **Database module**: PostgreSQL through TypeORM, with migration scripts configured.
- **Shared entities, DTOs, enums and helpers**.

## Design choices

- **Clean separation of concerns**: controllers → services → repositories inside each microservice; HTTP and RPC controllers are kept apart.
- **Validation at the edge**: global `ValidationPipe` with whitelisting and transformation on every service.
- **Versioned APIs** from day one (`VersioningType.URI`).
- **Response compression** on every service.
- **Versioned message patterns**: RPC patterns carry the API version (e.g. `ordersService.findOneById/v1`), so services can evolve without breaking their callers.
- **Data seeding** with Faker (`apps/main/src/seeders`) for local development and testing.

## Tech stack

NestJS 10 · TypeScript · RabbitMQ (`@nestjs/microservices`, AMQP) · PostgreSQL · TypeORM · JWT · Firebase Admin · Docker / Docker Compose · Nginx

## Running locally

```bash
cp .env.example .env        # fill in database, JWT and RabbitMQ settings
docker compose up --build   # starts all services, RabbitMQ and Nginx
```

Then call any service through Nginx, for example:

```
GET http://localhost/genak-products/api/v1/...
```

Database migrations:

```bash
npm run typeorm:migration:run
```

## Author

Mosab Ghorab, software engineer (Flutter, NestJS)
