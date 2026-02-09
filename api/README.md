# NestJS API with Better Auth

A production-ready NestJS 11 application with Better Auth authentication, Oracle Database integration, and modern development tooling.

## 🚀 Features

- **NestJS 11** - Modern Node.js framework
- **Better Auth** - Advanced authentication system with:
  - Email/Password authentication
  - Organization support (multi-tenancy)
  - Two-Factor Authentication (2FA)
  - Admin functionality
  - Session management
- **Oracle Database** - Enterprise-grade database with TypeORM
- **TypeScript** - Full type safety
- **Swagger** - API documentation
- **Validation** - Input validation with class-validator
- **ESLint & Prettier** - Code quality and formatting

## 📋 Prerequisites

- Node.js v22.x or higher
- pnpm (latest)
- Oracle Database 19c or later
- Oracle Instant Client (for local development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update with your Oracle database credentials:
   - `DB_HOST` - Oracle database host
   - `DB_PORT` - Oracle database port (default: 1521)
   - `DB_USERNAME` - Database username
   - `DB_PASSWORD` - Database password
   - `DB_SERVICE_NAME` - Oracle service name
   - `SESSION_SECRET` - Strong secret for session encryption

4. **Set up the database**
   
   Create the required tables using Better Auth schema. The entities are already defined in `src/database/entities/`.

## 🏃 Running the Application

### Development Mode
```bash
pnpm start:dev
```

### Production Mode
```bash
pnpm build
pnpm start:prod
```

### Debug Mode
```bash
pnpm start:debug
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api

## 🔐 Authentication Endpoints

Better Auth provides the following endpoints automatically:

- `POST /api/auth/sign-up/email` - Register with email/password
- `POST /api/auth/sign-in/email` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/two-factor/enable` - Enable 2FA
- `POST /api/auth/two-factor/verify` - Verify 2FA code
- `POST /api/auth/organization/create` - Create organization
- `GET /api/auth/organization/list` - List organizations

For complete API documentation, see the Swagger UI.

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Test Coverage
```bash
pnpm test:cov
```

## 📝 Code Quality

### Linting
```bash
pnpm lint
pnpm lint:fix
```

### Formatting
```bash
pnpm format
pnpm format:check
```

## 🗄️ Database Migrations

### Generate Migration
```bash
pnpm migration:generate -- src/database/migrations/MigrationName
```

### Run Migrations
```bash
pnpm migration:run
```

### Revert Migration
```bash
pnpm migration:revert
```

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   └── oracle.config.ts   # Oracle database config
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth-schema.ts
│   │   ├── decorators/   # Custom decorators
│   │   ├── guards/       # Route guards
│   │   └── hooks/        # Auth hooks
│   └── users/            # Users module
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── dto/          # Data transfer objects
├── database/             # Database layer
│   ├── entities/        # TypeORM entities
│   └── migrations/      # Database migrations
├── common/              # Shared utilities
│   ├── filters/        # Exception filters
│   ├── interceptors/   # Response interceptors
│   └── pipes/          # Custom pipes
├── app.module.ts       # Root module
└── main.ts            # Application entry point
```

## 🔒 Security Best Practices

- Never commit `.env` files
- Use strong secrets for session tokens
- Enable HTTPS in production
- Keep dependencies updated
- Use `DB_SYNCHRONIZE=false` in production
- Implement rate limiting (recommended)
- Validate all user inputs

## 🛡️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |
| `DB_HOST` | Oracle host | `localhost` |
| `DB_PORT` | Oracle port | `1521` |
| `DB_USERNAME` | Database user | - |
| `DB_PASSWORD` | Database password | - |
| `DB_SERVICE_NAME` | Oracle service name | `XEPDB1` |
| `DB_POOL_SIZE` | Connection pool size | `10` |
| `DB_SYNCHRONIZE` | Auto-sync schema (dev only!) | `false` |
| `DB_LOGGING` | Enable query logging | `false` |
| `SESSION_SECRET` | Session encryption key | - |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Better Auth Documentation](https://www.better-auth.com)
- [TypeORM Documentation](https://typeorm.io)
- [Oracle Node.js Documentation](https://node-oracledb.readthedocs.io)

