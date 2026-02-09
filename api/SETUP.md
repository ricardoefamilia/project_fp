# Quick Setup Guide

Follow these steps to get your NestJS application up and running.

## 1. Install Dependencies

```bash
cd api
pnpm install
```

## 2. Configure Environment

Create a `.env` file in the `api` directory with your Oracle database credentials:

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=NestJS App
APP_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Database - Oracle
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=ROOT
DB_PASSWORD=your_password
DB_SERVICE_NAME=FPAPI
DB_POOL_SIZE=10
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Better Auth
SESSION_SECRET=change-this-to-a-strong-random-secret-in-production
```

## 3. Set Up Database

### Option A: Create Tables Manually (Recommended)

Execute the SQL scripts in `src/database/migrations/README.md` directly in your Oracle database.

### Option B: Use TypeORM Migrations

```bash
pnpm migration:run
```

## 4. Start the Application

### Development Mode (with hot-reload)
```bash
pnpm start:dev
```

The application will start on http://localhost:3000

## 5. Access the API Documentation

Once running, visit:
- **API Documentation**: http://localhost:3000/api

## 6. Test the Application

### Test the public endpoint:
```bash
curl http://localhost:3000/users/public/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Users module is healthy",
  "timestamp": "2024-..."
}
```

### Sign up a new user:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123",
    "name": "Test User"
  }'
```

### Sign in:
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'
```

This will return a session token that you can use for authenticated requests.

### Get current session:
```bash
curl http://localhost:3000/api/auth/session \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## 7. Common Commands

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start:prod
```

## Troubleshooting

### Connection Issues

If you can't connect to Oracle:
1. Verify Oracle is running
2. Check the connection string in `.env`
3. Ensure Oracle Instant Client is installed (for local development)
4. Check firewall settings

### Module Not Found Errors

If you get module import errors:
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

```bash
pnpm build
```

This will show any TypeScript compilation errors.

## Next Steps

1. ✅ Customize the User entity as needed
2. ✅ Add more modules for your business logic
3. ✅ Set up environment-specific configs
4. ✅ Configure CORS for your frontend
5. ✅ Add rate limiting
6. ✅ Set up logging
7. ✅ Add monitoring

## Production Checklist

Before deploying to production:

- [ ] Change `SESSION_SECRET` to a strong random value
- [ ] Set `DB_SYNCHRONIZE=false`
- [ ] Set `DB_LOGGING=false` or configure proper logging
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Review security best practices
- [ ] Set up database backups
- [ ] Use environment-specific configuration

