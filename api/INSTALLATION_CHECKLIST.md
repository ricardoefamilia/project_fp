# Installation & Verification Checklist

Use this checklist to ensure your NestJS application is properly set up and running.

## ☑️ Pre-Installation Checklist

Before installing, verify you have:

- [ ] Node.js v22.x or higher
  ```bash
  node --version  # Should show v22.x.x
  ```

- [ ] pnpm installed
  ```bash
  pnpm --version  # Should show version number
  ```
  If not installed:
  ```bash
  npm install -g pnpm
  ```

- [ ] Oracle Database 19c or later running
  ```bash
  # Test Oracle listener
  lsnrctl status
  ```

- [ ] Oracle database credentials ready
  - Username
  - Password
  - Host
  - Port
  - Service Name

## 📦 Installation Steps

### Step 1: Install Dependencies

```bash
cd api
pnpm install
```

**Expected outcome**: 
- All dependencies installed successfully
- No error messages
- `node_modules/` directory created
- `pnpm-lock.yaml` created

**Verify**:
```bash
ls node_modules/ | wc -l  # Should show many packages
```

### Step 2: Create Environment File

```bash
# Create .env file with your configuration
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
APP_NAME=NestJS App
APP_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
DB_HOST=127.0.0.1
DB_PORT=1521
DB_USERNAME=ROOT
DB_PASSWORD=your_password_here
DB_SERVICE_NAME=FPAPI
DB_POOL_SIZE=10
DB_SYNCHRONIZE=false
DB_LOGGING=true
SESSION_SECRET=your-super-secret-session-key-at-least-32-characters-long
EOF
```

**Remember to change**:
- [ ] `DB_PASSWORD` to your actual Oracle password
- [ ] `SESSION_SECRET` to a strong random string

### Step 3: Verify TypeScript Compilation

```bash
pnpm build
```

**Expected outcome**:
- Build completes successfully
- `dist/` directory created
- No TypeScript errors

**If errors occur**:
- Check that all dependencies installed correctly
- Verify TypeScript version: `pnpm list typescript`

### Step 4: Set Up Database Tables

Choose one option:

#### Option A: Manual SQL (Recommended)
Execute the SQL scripts from `src/database/migrations/README.md` in your Oracle database.

#### Option B: TypeORM Migration
```bash
pnpm migration:run
```

**Verify tables created**:
```sql
-- Connect to Oracle and run:
SELECT table_name FROM user_tables WHERE table_name IN (
  'user', 'session', 'account', 'verification', 
  'organization', 'member', 'invitation', 'twoFactor'
);
```

Expected: All 8 tables should exist

### Step 5: Start Application

```bash
pnpm start:dev
```

**Expected outcome**:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [InstanceLoader] AuthModule dependencies initialized
[Nest] LOG [InstanceLoader] UsersModule dependencies initialized
[Nest] LOG [InstanceLoader] HealthModule dependencies initialized
[Nest] LOG [RoutesResolver] HealthController {/health}
[Nest] LOG [RouterExplorer] Mapped {/health, GET} route
[Nest] LOG [RoutesResolver] UsersController {/users}
[Nest] LOG [RouterExplorer] Mapped {/users/me, GET} route
[Nest] LOG [RouterExplorer] Mapped {/users, GET} route
[Nest] LOG [RouterExplorer] Mapped {/users/:id, GET} route
[Nest] LOG [NestApplication] Nest application successfully started

🚀 Application is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api
🔐 Auth endpoints: http://localhost:3000/api/auth/*
```

## ✅ Verification Tests

### Test 1: Health Check (Public)

```bash
curl http://localhost:3000/health
```

**Expected response**:
```json
{
  "status": "ok",
  "timestamp": "2024-10-11T...",
  "uptime": 12.345,
  "environment": "development"
}
```

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 2: Users Health Check (Public)

```bash
curl http://localhost:3000/users/public/health
```

**Expected response**:
```json
{
  "status": "ok",
  "message": "Users module is healthy",
  "timestamp": "2024-10-11T..."
}
```

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 3: Swagger Documentation

Open browser: http://localhost:3000/api

**Expected**: 
- Swagger UI loads successfully
- Shows endpoints for:
  - health
  - users
  - auth (Better Auth endpoints)

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 4: Protected Route (Should Fail)

```bash
curl http://localhost:3000/users/me
```

**Expected response**:
```json
{
  "statusCode": 401,
  "message": "Authentication required"
}
```

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 5: User Registration

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

**Expected**:
- Returns user object with ID
- Returns session token
- Status 200 or 201

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

**Save the session token**: ________________

### Test 6: User Login

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

**Expected**:
- Returns user object
- Returns session token
- Status 200

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 7: Access Protected Route

```bash
# Replace YOUR_TOKEN with token from Test 5 or 6
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**:
- Returns user and session information
- Status 200

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 8: Get All Users

```bash
# Replace YOUR_TOKEN with your session token
curl http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**:
- Returns array of users
- Status 200

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

## 🧪 Code Quality Tests

### Test 9: Linting

```bash
pnpm lint
```

**Expected**: No errors (warnings are okay)

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 10: Formatting Check

```bash
pnpm format:check
```

**Expected**: All files properly formatted

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 11: Unit Tests

```bash
pnpm test
```

**Expected**: Tests pass (or skip if no tests defined yet)

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

### Test 12: E2E Tests

```bash
pnpm test:e2e
```

**Expected**: E2E tests pass

**Status**: [ ] ✅ Pass / [ ] ❌ Fail

## 🐛 Troubleshooting

### Issue: Dependencies not installing

**Symptoms**: `pnpm install` fails

**Solutions**:
1. Clear cache: `pnpm store prune`
2. Delete `node_modules` and `pnpm-lock.yaml`
3. Try again: `pnpm install`
4. Check Node.js version: `node --version`

### Issue: Cannot connect to Oracle

**Symptoms**: Connection timeout or refused

**Solutions**:
1. Verify Oracle is running: `lsnrctl status`
2. Test with SQL*Plus: `sqlplus username/password@host:port/service`
3. Check firewall: `telnet localhost 1521`
4. Verify credentials in `.env`
5. Check DB_SERVICE_NAME is correct

### Issue: TypeScript compilation errors

**Symptoms**: Build fails with type errors

**Solutions**:
1. Ensure dependencies installed: `pnpm install`
2. Check TypeScript version: `pnpm list typescript`
3. Clean and rebuild: `rm -rf dist && pnpm build`
4. Check tsconfig.json is correct

### Issue: Application starts but routes don't work

**Symptoms**: 404 errors on all routes

**Solutions**:
1. Check that app is listening on correct port
2. Verify no firewall blocking
3. Check logs for module initialization errors
4. Ensure Better Auth module loaded correctly

### Issue: Better Auth endpoints not working

**Symptoms**: 404 on /api/auth/* routes

**Solutions**:
1. Verify AuthModule is imported in AppModule
2. Check database tables exist
3. Check SESSION_SECRET is set in .env
4. Review application logs for errors

### Issue: Session/authentication not persisting

**Symptoms**: Can sign in but session doesn't persist

**Solutions**:
1. Check SESSION_SECRET is set
2. Verify session table exists in database
3. Check token is being sent in Authorization header
4. Ensure CORS is configured correctly

## 📊 Success Criteria

Your installation is successful when:

- [ ] All dependencies installed (`pnpm install`)
- [ ] Build completes without errors (`pnpm build`)
- [ ] Application starts successfully (`pnpm start:dev`)
- [ ] Health checks return 200 OK
- [ ] Swagger UI loads at /api
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes require authentication
- [ ] Authenticated requests work with token
- [ ] No critical errors in logs

## 🎯 Final Checklist

- [ ] ✅ All 12 verification tests pass
- [ ] ✅ No critical errors in console
- [ ] ✅ Database connection working
- [ ] ✅ All routes responding correctly
- [ ] ✅ Authentication flow complete
- [ ] ✅ Swagger documentation accessible
- [ ] ✅ Code quality checks pass

## 📝 Post-Installation Tasks

Once everything is working:

1. [ ] Change SESSION_SECRET to a production-ready value
2. [ ] Review and customize environment variables
3. [ ] Set up additional environment files (.env.production)
4. [ ] Configure CORS for your frontend domain
5. [ ] Add custom business logic
6. [ ] Write additional tests
7. [ ] Set up CI/CD pipeline
8. [ ] Configure monitoring and logging
9. [ ] Plan deployment strategy
10. [ ] Review security best practices

## 🎉 Congratulations!

If all checks pass, your NestJS application is successfully installed and ready for development!

**Next Steps**:
- Read GETTING_STARTED.md for detailed usage
- Review STRUCTURE.md to understand the codebase
- Check PROJECT_SUMMARY.md for features overview
- Start building your features!

---

**Installation Date**: ____________

**Installed By**: ____________

**Notes**: ____________________________________________

