# Getting Started

This guide will help you set up and run your NestJS application with Better Auth and Oracle Database.

## Prerequisites Checklist

Before you begin, ensure you have:

- ✅ Node.js v22.x or higher installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Oracle Database 19c or later running
- ✅ Oracle database credentials (username, password, service name)
- ✅ Network access to Oracle database

## Step-by-Step Setup

### Step 1: Install Dependencies

Navigate to the api directory and install all required packages:

```bash
cd api
pnpm install
```

This will install all dependencies specified in `package.json`.

### Step 2: Configure Environment Variables

Create a `.env` file in the `api` directory:

```bash
# Copy this content to .env file

# Application Settings
NODE_ENV=development
PORT=3000
APP_NAME=NestJS App
APP_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Oracle Database Configuration
DB_TYPE=oracle
DB_HOST=127.0.0.1
DB_PORT=1521
DB_USERNAME=ROOT
DB_PASSWORD=your_password_here
DB_SERVICE_NAME=FPAPI
DB_POOL_SIZE=10
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Better Auth Session Secret (IMPORTANT: Change this!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production-use-at-least-32-characters
```

**⚠️ IMPORTANT**: Replace the following values:
- `DB_PASSWORD`: Your actual Oracle database password
- `SESSION_SECRET`: A strong random string (use a password generator)

### Step 3: Set Up Database Tables

You have two options to create the required database tables:

#### Option A: Manual SQL Execution (Recommended for Production)

1. Connect to your Oracle database using SQL*Plus, SQL Developer, or your preferred tool
2. Execute the SQL scripts found in `src/database/migrations/README.md`
3. Verify all tables are created successfully

#### Option B: Using TypeORM Migrations (Development)

Run the migration command:

```bash
pnpm migration:run
```

**Note**: You may need to generate migrations first if you modify entities.

### Step 4: Verify Database Connection

Before starting the app, verify your database configuration:

1. Check that Oracle is running:
   ```bash
   # If running locally
   lsnrctl status
   ```

2. Test connection using SQL*Plus:
   ```bash
   sqlplus ROOT/your_password@127.0.0.1:1521/FPAPI
   ```

3. Verify tables exist:
   ```sql
   SELECT table_name FROM user_tables;
   ```

   Expected tables:
   - user
   - session
   - account
   - verification
   - organization
   - member
   - invitation
   - twoFactor

### Step 5: Start the Application

#### Development Mode (with auto-reload)

```bash
pnpm start:dev
```

You should see output similar to:

```
[Nest] 12345  - MM/DD/YYYY, HH:MM:SS AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - MM/DD/YYYY, HH:MM:SS AM     LOG [InstanceLoader] AppModule dependencies initialized
...
🚀 Application is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api
🔐 Auth endpoints: http://localhost:3000/api/auth/*
```

#### Production Mode

```bash
pnpm build
pnpm start:prod
```

### Step 6: Verify Installation

#### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-10-11T...",
  "uptime": 123.456,
  "environment": "development"
}
```

#### Test 2: Users Health Check

```bash
curl http://localhost:3000/users/public/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Users module is healthy",
  "timestamp": "2024-10-11T..."
}
```

#### Test 3: API Documentation

Open your browser and navigate to:
- http://localhost:3000/api

You should see the Swagger UI with all available endpoints.

### Step 7: Test Authentication Flow

#### 1. Sign Up a New User

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    ...
  },
  "session": {
    "token": "...",
    "expiresAt": ...
  }
}
```

#### 2. Sign In

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

Save the session token from the response.

#### 3. Access Protected Route

```bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN_HERE"
```

Replace `YOUR_SESSION_TOKEN_HERE` with the actual token from the sign-in response.

## Common Issues and Solutions

### Issue 1: Cannot Connect to Oracle Database

**Error**: `ORA-12545: Connect failed because target host or object does not exist`

**Solutions**:
- Verify Oracle is running
- Check DB_HOST and DB_PORT in .env
- Ensure firewall allows connection on port 1521
- Try using 127.0.0.1 instead of localhost

### Issue 2: Authentication Errors

**Error**: `TNS:could not resolve the connect identifier specified`

**Solutions**:
- Verify DB_SERVICE_NAME is correct
- Check tnsnames.ora configuration
- Use full connection string: `host:port/service_name`

### Issue 3: Module Import Errors

**Error**: `Cannot find module ...`

**Solutions**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue 4: TypeScript Compilation Errors

**Solutions**:
```bash
pnpm build
```

Review the error output and fix any type issues.

### Issue 5: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solutions**:
- Change PORT in .env to a different port (e.g., 3001)
- Kill the process using port 3000:
  ```bash
  # Find process
  lsof -i :3000
  # Kill process
  kill -9 <PID>
  ```

## Development Workflow

### Code Formatting

Format your code before committing:
```bash
pnpm format
```

Check formatting:
```bash
pnpm format:check
```

### Linting

Run ESLint:
```bash
pnpm lint
```

Fix linting errors automatically:
```bash
pnpm lint:fix
```

### Testing

Run unit tests:
```bash
pnpm test
```

Run e2e tests:
```bash
pnpm test:e2e
```

Generate coverage report:
```bash
pnpm test:cov
```

### Database Migrations

Generate a new migration:
```bash
pnpm migration:generate -- src/database/migrations/YourMigrationName
```

Run pending migrations:
```bash
pnpm migration:run
```

Revert last migration:
```bash
pnpm migration:revert
```

## Next Steps

Now that your application is running, you can:

1. **Explore the API**: Visit http://localhost:3000/api to see all available endpoints
2. **Add Custom Modules**: Create new modules for your business logic
3. **Configure Better Auth Plugins**: Enable additional features like OAuth providers
4. **Set Up Frontend**: Connect your frontend application using the API endpoints
5. **Add Monitoring**: Implement logging and monitoring solutions
6. **Deploy**: Prepare your application for production deployment

## Useful Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Better Auth Documentation](https://www.better-auth.com)
- [TypeORM Documentation](https://typeorm.io)
- [Oracle Node.js Documentation](https://node-oracledb.readthedocs.io)

## Need Help?

- Check the README.md for detailed documentation
- Review SETUP.md for quick reference
- Check the API documentation at /api endpoint
- Review the source code in src/ directory

## Production Deployment Checklist

Before deploying to production:

- [ ] Change SESSION_SECRET to a strong random value (min 32 characters)
- [ ] Set NODE_ENV=production
- [ ] Set DB_SYNCHRONIZE=false (CRITICAL!)
- [ ] Set DB_LOGGING=false
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set up environment variables securely (use secrets management)
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Set up database backups
- [ ] Review and test all security settings
- [ ] Load test your application
- [ ] Set up CI/CD pipeline
- [ ] Document your deployment process

---

**Congratulations!** 🎉 Your NestJS application is now set up and running!

