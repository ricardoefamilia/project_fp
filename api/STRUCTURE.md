# Project Structure

Complete visual representation of the NestJS application structure.

```
api/
│
├── 📄 Configuration Files
│   ├── package.json                  # Dependencies and scripts
│   ├── pnpm-lock.yaml               # Package lock file (generated)
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tsconfig.build.json          # Build-specific TS config
│   ├── nest-cli.json                # NestJS CLI configuration
│   ├── eslint.config.mjs            # ESLint v9 flat config
│   ├── .prettierrc                  # Prettier formatting rules
│   ├── .prettierignore              # Prettier ignore patterns
│   ├── .swcrc                       # SWC compiler configuration
│   ├── .gitignore                   # Git ignore patterns
│   ├── .env                         # Environment variables (create this!)
│   └── typeorm.config.ts            # TypeORM CLI configuration
│
├── 📚 Documentation
│   ├── README.md                    # Main documentation
│   ├── SETUP.md                     # Quick setup guide
│   ├── GETTING_STARTED.md           # Detailed tutorial
│   ├── PROJECT_SUMMARY.md           # Implementation overview
│   └── STRUCTURE.md                 # This file
│
├── 📁 src/                          # Source code directory
│   │
│   ├── 🚀 Application Entry
│   │   ├── main.ts                  # Bootstrap application
│   │   └── app.module.ts            # Root application module
│   │
│   ├── ⚙️ config/                   # Configuration modules
│   │   └── oracle.config.ts         # Oracle DB configuration factory
│   │
│   ├── 🗄️ database/                 # Database layer
│   │   │
│   │   ├── entities/                # TypeORM entities (Better Auth schema)
│   │   │   ├── user.entity.ts       # User table entity
│   │   │   ├── session.entity.ts    # Session management
│   │   │   ├── account.entity.ts    # OAuth accounts
│   │   │   ├── verification.entity.ts  # Email verification
│   │   │   ├── organization.entity.ts  # Organizations (multi-tenancy)
│   │   │   ├── member.entity.ts     # Organization members
│   │   │   ├── invitation.entity.ts # Organization invitations
│   │   │   └── two-factor.entity.ts # 2FA secrets
│   │   │
│   │   └── migrations/              # Database migrations
│   │       ├── 1760109600000-initial-schema.ts  # Sample migration
│   │       └── README.md            # SQL scripts for manual setup
│   │
│   ├── 🧩 modules/                  # Feature modules
│   │   │
│   │   ├── 🔐 auth/                 # Authentication module
│   │   │   ├── auth.module.ts       # Auth module definition
│   │   │   ├── auth-schema.ts       # Better Auth configuration
│   │   │   │
│   │   │   ├── decorators/          # Custom decorators
│   │   │   │   ├── public.decorator.ts    # @Public() - Skip auth
│   │   │   │   ├── optional.decorator.ts  # @Optional() - Optional auth
│   │   │   │   └── session.decorator.ts   # @Session() - Get session
│   │   │   │
│   │   │   ├── guards/              # Route guards
│   │   │   │   └── auth.guard.ts    # Authentication guard
│   │   │   │
│   │   │   └── hooks/               # Better Auth hooks
│   │   │       └── sign-up.hook.ts  # Sign-up validation
│   │   │
│   │   └── 👥 users/                # Users management module
│   │       ├── users.module.ts      # Users module definition
│   │       ├── users.controller.ts  # REST endpoints
│   │       ├── users.service.ts     # Business logic
│   │       │
│   │       └── dto/                 # Data Transfer Objects
│   │           └── update-user.dto.ts  # Update user DTO
│   │
│   └── 🔧 common/                   # Shared utilities
│       │
│       ├── health/                  # Health check module
│       │   ├── health.module.ts
│       │   └── health.controller.ts # GET /health endpoint
│       │
│       ├── filters/                 # Exception filters
│       │   └── http-exception.filter.ts  # Global error handler
│       │
│       ├── interceptors/            # Response interceptors
│       │   └── transform.interceptor.ts  # Response transformation
│       │
│       └── pipes/                   # Custom pipes
│           └── validation.pipe.ts   # Input validation
│
├── 🧪 test/                         # Test files
│   ├── app.e2e-spec.ts             # E2E tests
│   └── jest-e2e.json               # Jest E2E configuration
│
├── 📦 node_modules/                 # Dependencies (generated)
│
└── 🏗️ dist/                         # Compiled output (generated)
```

## Module Dependencies

```
AppModule
├── ConfigModule (Global)
├── TypeOrmModule.forRoot
│   └── Oracle Database Connection
├── HealthModule
│   └── HealthController
├── AuthModule
│   ├── BetterAuthModule
│   │   ├── Kysely + OracleDialect
│   │   └── Better Auth Plugins
│   ├── AuthGuard
│   └── SignUpHook
└── UsersModule
    ├── TypeOrmModule.forFeature([User])
    ├── UsersController
    │   ├── GET /users/me
    │   ├── GET /users
    │   ├── GET /users/:id
    │   ├── PATCH /users/:id
    │   ├── DELETE /users/:id
    │   └── GET /users/public/health
    └── UsersService
```

## Authentication Flow

```
1. Request comes in
   ↓
2. AuthGuard.canActivate()
   ↓
3. Check for @Public() decorator
   ├─ Yes → Allow access
   └─ No → Continue
   ↓
4. Validate session token
   ├─ Valid → Attach user to request
   └─ Invalid → Check @Optional()
      ├─ Yes → Continue
      └─ No → Throw UnauthorizedException
   ↓
5. Route handler executes
   ↓
6. Access user via @Session() decorator
```

## Database Connection Flow

```
TypeORM (Entities & Migrations)
└── Oracle Connection Pool
    └── Connection String

Better Auth (Session Management)
└── Kysely + OracleDialect
    └── Oracle Connection Pool (separate)
        └── Same Connection String

Both use same credentials from .env
```

## Request/Response Flow

```
HTTP Request
   ↓
NestJS Core
   ↓
Global Middleware
   ↓
AuthGuard (if protected route)
   ↓
Controller Method
   ↓
Service Layer
   ↓
TypeORM Repository
   ↓
Oracle Database
   ↓
Service Response
   ↓
Controller Response
   ↓
Transform Interceptor (optional)
   ↓
Exception Filter (if error)
   ↓
HTTP Response
```

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Module | `*.module.ts` | `users.module.ts` |
| Controller | `*.controller.ts` | `users.controller.ts` |
| Service | `*.service.ts` | `users.service.ts` |
| Entity | `*.entity.ts` | `user.entity.ts` |
| DTO | `*.dto.ts` | `update-user.dto.ts` |
| Guard | `*.guard.ts` | `auth.guard.ts` |
| Decorator | `*.decorator.ts` | `session.decorator.ts` |
| Filter | `*.filter.ts` | `http-exception.filter.ts` |
| Pipe | `*.pipe.ts` | `validation.pipe.ts` |
| Interceptor | `*.interceptor.ts` | `transform.interceptor.ts` |
| Migration | `[timestamp]-*.ts` | `1760109600000-initial-schema.ts` |
| Test | `*.spec.ts` | `users.service.spec.ts` |
| E2E Test | `*.e2e-spec.ts` | `app.e2e-spec.ts` |

## Configuration Files Purpose

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, dependencies, scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `tsconfig.build.json` | Build-specific TypeScript settings |
| `nest-cli.json` | NestJS CLI configuration and build settings |
| `eslint.config.mjs` | ESLint rules and configuration |
| `.prettierrc` | Code formatting rules |
| `.swcrc` | SWC (fast compiler) configuration |
| `typeorm.config.ts` | TypeORM CLI configuration for migrations |
| `.env` | Environment variables (not in git) |

## Environment Variables

Required variables in `.env`:

```
Application:
├── NODE_ENV          # development | production | test
├── PORT              # Application port (default: 3000)
├── APP_NAME          # Application name
└── APP_URL           # Application URL

Database:
├── DB_HOST           # Oracle host
├── DB_PORT           # Oracle port (default: 1521)
├── DB_USERNAME       # Database username
├── DB_PASSWORD       # Database password
├── DB_SERVICE_NAME   # Oracle service name
├── DB_POOL_SIZE      # Connection pool size
├── DB_SYNCHRONIZE    # Auto-sync schema (dev only!)
└── DB_LOGGING        # Enable query logging

Security:
└── SESSION_SECRET    # Session encryption key
```

## API Endpoints Overview

### Health Checks
- `GET /health` - Application health
- `GET /users/public/health` - Module health (public)

### Authentication (Better Auth)
- `POST /api/auth/sign-up/email` - Register
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get session
- `POST /api/auth/two-factor/enable` - Enable 2FA
- `POST /api/auth/two-factor/verify` - Verify 2FA
- `POST /api/auth/organization/create` - Create org
- `GET /api/auth/organization/list` - List orgs

### Users (Protected)
- `GET /users/me` - Current user profile
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Documentation
- `GET /api` - Swagger UI

## Development Workflow

```
1. Edit source files in src/
2. NestJS watches for changes (in dev mode)
3. SWC compiles TypeScript
4. Application hot-reloads
5. Test changes
6. Run linter: pnpm lint:fix
7. Format code: pnpm format
8. Run tests: pnpm test
9. Commit changes
```

## Build Process

```
Development:
pnpm start:dev
   ↓
NestJS CLI (watch mode)
   ↓
SWC compilation
   ↓
Hot reload

Production:
pnpm build
   ↓
NestJS CLI (build)
   ↓
SWC compilation
   ↓
Output to dist/
   ↓
pnpm start:prod
   ↓
Run from dist/main.js
```

---

This structure follows NestJS best practices and provides a scalable foundation for your application.

