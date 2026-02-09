# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **full-stack monorepo** project called "Farmácia Popular" consisting of:

- **Backend (API)**: NestJS 11 application with Better Auth authentication and Oracle Database integration
- **Frontend**: Modern React 19+ SPA built with Vite 7, TypeScript, Tailwind CSS 4, and shadcn/ui components

The project implements a complete authentication system with support for email/password login and Gov.br OAuth integration.

## Development Commands

### Backend (API)

#### Setup

```bash
cd api
pnpm install

# Start Docker services (Oracle DB)
docker compose up -d

# Wait for database to be ready (check logs)
docker compose logs -f oracle

# Run database migrations
pnpm migration:run
```

#### Running the API

```bash
# Development with watch mode
pnpm start:dev

# Production build and run
pnpm build
pnpm start:prod

# Debug mode
pnpm start:debug
```

#### Testing

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Generate test coverage
pnpm test:cov
```

#### Code Quality

```bash
# Lint and auto-fix
pnpm lint
pnpm lint:fix

# Format code
pnpm format
pnpm format:check
```

#### Database Migrations

```bash
# Run pending migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert

# Generate new migration from entity changes
pnpm migration:generate -- -n MigrationName
```

**Important**: Oracle-specific types must be used in migrations and entities:

- Use `VARCHAR2(4000)` instead of `text`
- Use `TIMESTAMP` instead of `date`
- Use `NUMBER(1)` instead of `boolean`
- Use `NUMBER` for integers

### Frontend

#### Setup

```bash
cd frontend
npm install
```

#### Running the Frontend

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

#### Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Type check
npm run type-check
```

#### Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Test coverage
npm run test:coverage

# Test UI
npm run test:ui
```

#### Adding UI Components

```bash
# Add shadcn/ui component
npx shadcn@latest add <component-name>

# Examples:
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## Architecture

### System Overview

```
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│    Frontend      │◄───────►│   Backend API    │
│  React + Vite    │  HTTP   │   NestJS 11      │
│  Better Auth     │         │   Better Auth    │
│  Tailwind CSS    │         │   TypeORM        │
│                  │         │                  │
└──────────────────┘         └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │                  │
                            │  Oracle Database │
                            │   (Docker XE)    │
                            │                  │
                            └──────────────────┘
```

### Backend Architecture

#### Database Configuration

The application uses **Oracle Database XE 21c** (via Docker):

- **TypeORM**: Main application database connection for entities
- **Better Auth TypeORM Adapter**: Custom adapter for Better Auth integration
- **Shared DataSource**: Both use the same Oracle connection instance configured in `database.config.ts`
- Uses **serviceName** instead of SID for Pluggable Database (PDB) connections
- Environment variables: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SERVICE_NAME`
- Custom schema mapping in `auth-schema.ts` maps Better Auth tables to Oracle column naming conventions

**Docker setup**:

```bash
# From project root
docker compose up -d           # Start Oracle XE 21c container
docker compose logs -f oracle  # Monitor startup (wait for "DATABASE IS READY TO USE!")
```

**Connection Details**:

- Host: localhost
- Port: 1521
- Service Name: FPAPI
- User: root
- Password: root (default, change in production)

**Important**: Oracle uses Pluggable Databases (PDBs). The `DB_SERVICE_NAME` must match the PDB name (e.g., FPAPI), not the container database (XE).

#### Authentication System

Uses **Better Auth** with custom TypeORM adapter. Key features:

- **Email/password authentication**: Standard login with validation
- **Gov.br OAuth**: Integration with Brazilian government authentication (feature/govbr-oauth branch)
- **Admin plugin**: Admin functionality with user impersonation
- **Organization management**: Multi-tenant support with organization limits
- **Two-factor authentication**: TOTP-based 2FA
- **OpenAPI schema generation**: Auto-generated API documentation

**Auth locations**:

- `api/src/modules/auth/auth.ts` - Better Auth configuration
- `api/src/modules/auth/auth-schema.ts` - Oracle table/column mappings
- `api/src/modules/auth/adapters/typeorm/` - Custom TypeORM adapter
- `api/src/modules/auth/guards/auth.guard.ts` - NestJS auth guard
- `api/src/modules/auth/decorators/` - Custom decorators (@Public, @Session, @Optional)

**Auth Endpoints** (auto-generated by Better Auth):

- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - Email/password login
- `GET /api/auth/sign-in/oauth` - OAuth login initiation
- `GET /api/auth/callback/oauth` - OAuth callback
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/two-factor/enable` - Enable 2FA
- `POST /api/auth/two-factor/verify` - Verify 2FA code
- `POST /api/auth/organization/create` - Create organization
- `GET /api/auth/organization/list` - List organizations

Global `AuthGuard` protects all routes by default (use `@Public()` decorator for public routes).

#### API Documentation

Access points:

- `http://localhost:3000/api` - Swagger UI (development)
- Combined OpenAPI spec includes NestJS endpoints + Better Auth endpoints

#### Global Configuration

- **Global prefix**: `/api` for all routes
- **Validation**: Global ValidationPipe with strict validation
- **CORS**: Enabled in development mode
- **Port**: 3000 (configurable via `PORT` env var)
- **Compilation**: SWC for fast builds
- **TypeScript**: ES2023 target with NodeNext modules

### Frontend Architecture

#### Technology Stack

- **React 19.2+**: Latest React with concurrent features
- **Vite 7+**: Lightning-fast build tool with HMR
- **TypeScript 5.7+**: Strict type safety
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible components
- **TanStack Query 5+**: Server state management
- **TanStack Form**: Type-safe form handling
- **Better Auth React**: Client SDK for authentication
- **Zod 3.24+**: Runtime schema validation
- **React Router 7+**: Client-side routing

#### Frontend Structure

```
frontend/src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   ├── shared/          # Reusable custom components (UserForm, ThemeToggle)
│   ├── LoginForm.tsx    # Login form with validation
│   ├── ProtectedRoute.tsx  # Route protection component
│   └── ErrorBoundary.tsx   # Error handling
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── LoginPage.tsx    # Login page
│   └── DashboardPage.tsx # Protected dashboard
├── contexts/
│   └── AuthContext.tsx  # Global auth state
├── hooks/
│   ├── useAuth.ts       # Auth operations (login, logout)
│   ├── useTheme.tsx     # Dark mode toggle
│   └── useMobile.ts     # Responsive helpers
├── lib/
│   ├── auth-client.ts   # Better Auth client config
│   ├── axios.ts         # HTTP client with interceptors
│   ├── queryClient.ts   # React Query config
│   └── utils.ts         # Utility functions
├── schemas/
│   ├── auth.schema.ts   # Auth validation schemas
│   └── user.schema.ts   # User validation schemas
└── routes/
    └── index.tsx        # Route configuration
```

#### Authentication Flow

1. User accesses protected route
2. `ProtectedRoute` checks authentication status via `AuthContext`
3. If not authenticated, redirects to `/login`
4. User submits `LoginForm` with credentials
5. `useLogin` hook sends request to backend via Better Auth client
6. On success, `AuthContext` updates with user session
7. User is redirected to original destination or dashboard
8. All subsequent API requests include auth cookies automatically

#### State Management Strategy

- **Server State**: TanStack Query for API data (caching, background updates)
- **Auth State**: React Context + Better Auth client
- **Client State**: Zustand for global client-side state (minimal setup)
- **Form State**: TanStack Form with Zod validation
- **UI State**: Local component state with useState
- **Theme**: next-themes for dark/light mode persistence

##### Zustand Store (Minimal Setup)

The application uses **Zustand** for client-side state management with a minimal configuration:

```typescript
// frontend/src/stores/store.ts
export const useStore = create<StoreState>()(
  withMiddleware(() => ({
    _initialized: true,  // Placeholder - extend as needed
  }))
)
```

**Key Features:**
- ✅ **Redux DevTools Integration**: Full debugging support in development
- ✅ **Persistence Middleware**: LocalStorage support (configurable)
- ✅ **TypeScript**: Full type safety
- ✅ **Minimal Boilerplate**: Add state only when needed
- ✅ **No Provider Wrapper**: Use directly in components

**What is Zustand?**

Zustand is a lightweight (1KB) state management library that's simpler than Redux but more powerful than Context API:

- **No Providers**: No wrapper components needed
- **Selective Subscriptions**: Components only re-render when their data changes
- **DevTools**: Full Redux DevTools support
- **Persistence**: Built-in localStorage middleware
- **TypeScript**: First-class TypeScript support

**Core Concepts:**

1. **Store**: Central state container created with `create()`
2. **State**: Your application data and actions
3. **Slices**: Modular pieces of state (optional pattern)
4. **Middleware**: Plugins like devtools, persist, immer
5. **Selectors**: Functions to read specific state (optimized re-renders)

**Store Structure:**

```
frontend/src/stores/
├── index.ts              # Main exports (public API)
├── store.ts              # Store creation with middleware
├── types.ts              # TypeScript type definitions
├── middleware.ts         # DevTools + persistence config
├── devtools-config.ts    # Advanced DevTools options
├── slices/               # Add state slices here (currently empty)
└── *.md                  # Documentation files
```

**When to Use Zustand:**

✅ **Use for:**
- Global client state (user preferences, UI state)
- State shared across multiple components
- State that needs persistence (localStorage)
- Complex state with multiple actions
- State that needs debugging with DevTools

❌ **Don't use for:**
- Server state (use TanStack Query)
- Auth state (already using React Query + Context)
- Form state (use TanStack Form)
- Component-local state (use useState)
- Route state (use React Router)

**Zustand Examples:**

1. **Basic Store Usage:**

```typescript
// Simple usage in components
import { useStore } from '@/stores'

function MyComponent() {
  const state = useStore()  // Get all state
  return <div>{state._initialized ? 'Ready' : 'Loading'}</div>
}

// Selective subscription (optimized)
function OptimizedComponent() {
  const count = useStore((state) => state.count)  // Only re-renders when count changes
  return <div>Count: {count}</div>
}
```

2. **Slice Pattern (Modular State):**

```typescript
// Create a slice: stores/slices/counter.slice.ts
export const createCounterSlice = (set: any) => ({
  count: 0,
  increment: () => set((state: any) => ({ count: state.count + 1 })),
  decrement: () => set((state: any) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
})

// Add to store: stores/store.ts
import { createCounterSlice } from './slices/counter.slice'

export const useStore = create<StoreState>()(
  withMiddleware((...args) => ({
    _initialized: true,
    ...createCounterSlice(...args),
  }))
)

// Use in components
function Counter() {
  const { count, increment, decrement, reset } = useStore()
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

3. **Middleware Configuration:**

```typescript
// stores/middleware.ts
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

// Persistence: Save specific state to localStorage
export const persistConfig = {
  name: 'fp-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state: StoreState) => ({
    // Only these fields are saved to localStorage
    count: state.count,
    userPreferences: state.userPreferences,
  }),
  version: 1,
}

// DevTools: Debug in browser with Redux DevTools
export const devtoolsConfig = {
  name: 'FP Store',
  enabled: import.meta.env.DEV,  // Only in development
  trace: true,  // Show stack traces
  traceLimit: 25,
}

// Apply middleware
export const withMiddleware = (storeCreator: StateCreator<StoreState>) => {
  return devtools(
    persist(storeCreator, persistConfig),
    devtoolsConfig
  )
}
```

4. **Named Actions (Better Debugging):**

```typescript
// Add action names for Redux DevTools
increment: () => set(
  (state) => ({ count: state.count + 1 }),
  false,
  'counter/increment'  // ← Shows in DevTools as "counter/increment"
)

// Without action name (shows as "anonymous")
increment: () => set((state) => ({ count: state.count + 1 }))
```

5. **Complex State with Multiple Slices:**

```typescript
// stores/types.ts
export interface StoreState {
  _initialized: boolean
  // Counter slice
  count: number
  increment: () => void
  decrement: () => void
  // User preferences slice
  theme: 'light' | 'dark'
  language: string
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: string) => void
}

// stores/slices/counter.slice.ts
export const createCounterSlice = (set: any) => ({
  count: 0,
  increment: () => set((state: any) => ({ count: state.count + 1 }), false, 'counter/increment'),
  decrement: () => set((state: any) => ({ count: state.count - 1 }), false, 'counter/decrement'),
})

// stores/slices/preferences.slice.ts
export const createPreferencesSlice = (set: any) => ({
  theme: 'light' as const,
  language: 'pt-BR',
  setTheme: (theme: 'light' | 'dark') => set({ theme }, false, 'preferences/setTheme'),
  setLanguage: (language: string) => set({ language }, false, 'preferences/setLanguage'),
})

// stores/store.ts
import { createCounterSlice } from './slices/counter.slice'
import { createPreferencesSlice } from './slices/preferences.slice'

export const useStore = create<StoreState>()(
  withMiddleware((...args) => ({
    _initialized: true,
    ...createCounterSlice(...args),
    ...createPreferencesSlice(...args),
  }))
)
```

6. **Accessing Store Outside React:**

```typescript
// In utility functions, event handlers, or API interceptors
import { useStore } from '@/stores'

// Get current state
const currentCount = useStore.getState().count

// Update state
useStore.getState().increment()

// Subscribe to changes
const unsubscribe = useStore.subscribe((state) => {
  console.log('Count changed:', state.count)
})

// Later: cleanup
unsubscribe()
```

**Redux DevTools Debugging:**

1. **Install Browser Extension:**
   - Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
   - Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

2. **Open DevTools:**
   - Run `pnpm dev` in frontend
   - Press F12 → Click "Redux" tab
   - See "FP Store" connected

3. **Features Available:**
   - **Action List**: See all actions dispatched (e.g., "counter/increment")
   - **State Inspector**: View entire store state
   - **Time Travel**: Click any past action to jump back
   - **Diff View**: See what changed in each action
   - **Export/Import**: Save/load state for debugging
   - **Stack Traces**: See where actions were called (enabled)

4. **Debugging Workflow:**
   ```typescript
   // 1. Trigger an action in your app
   increment()

   // 2. Open Redux DevTools → See "counter/increment" action
   // 3. Click action → View state before/after
   // 4. See diff: { count: 0 → 1 }
   // 5. Time travel: Click older action to rollback
   // 6. Export state for bug reports
   ```

**Documentation:**
- Complete guide: `frontend/src/stores/README.md`
- DevTools guide: `frontend/src/stores/DEVTOOLS_GUIDE.md`
- Setup verification: `frontend/src/stores/SETUP_VERIFICATION.md`
- Main setup doc: `frontend/ZUSTAND_SETUP.md`

#### Styling Approach

- **Tailwind CSS 4**: Utility-first CSS with custom theme
- **CSS Variables**: Theme colors defined as CSS custom properties
- **Mobile-first**: Responsive design with Tailwind breakpoints
- **Dark Mode**: System preference detection + manual toggle
- **Component Library**: shadcn/ui for consistent, accessible UI

## Project Structure

```
project-root/
├── api/                          # Backend (NestJS)
│   ├── src/
│   │   ├── main.ts              # Application entry point
│   │   ├── app.module.ts        # Root module
│   │   ├── config/
│   │   │   ├── database.config.ts    # Database configuration
│   │   │   └── database.module.ts    # Database module
│   │   ├── database/
│   │   │   ├── entities/        # TypeORM entities (8 Better Auth entities)
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── session.entity.ts
│   │   │   │   ├── account.entity.ts
│   │   │   │   ├── verification.entity.ts
│   │   │   │   ├── organization.entity.ts
│   │   │   │   ├── member.entity.ts
│   │   │   │   ├── invitation.entity.ts
│   │   │   │   └── two-factor.entity.ts
│   │   │   └── migrations/      # Database migrations
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.ts           # Better Auth config
│   │   │   │   ├── auth-schema.ts    # Oracle mappings
│   │   │   │   ├── adapters/typeorm/ # Custom TypeORM adapter
│   │   │   │   ├── decorators/       # @Public, @Session, @Optional
│   │   │   │   ├── guards/           # AuthGuard
│   │   │   │   └── hooks/            # sign-up.hook.ts
│   │   │   └── users/
│   │   │       ├── users.module.ts
│   │   │       ├── users.controller.ts
│   │   │       ├── users.service.ts
│   │   │       └── dto/
│   │   │           └── update-user.dto.ts
│   │   └── common/
│   │       ├── health/          # Health check module
│   │       ├── filters/         # Exception filters
│   │       ├── interceptors/    # Response interceptors
│   │       └── pipes/           # Validation pipes
│   ├── test/
│   │   └── app.e2e-spec.ts
│   ├── docker-compose.yml       # Oracle DB container
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── eslint.config.mjs
│
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── main.tsx             # Entry point
│   │   ├── App.tsx              # Root component
│   │   ├── app.css              # Global styles
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── shared/          # Custom reusable components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── stores/              # Zustand state management
│   │   │   ├── index.ts         # Main exports
│   │   │   ├── store.ts         # Store creation
│   │   │   ├── types.ts         # TypeScript types
│   │   │   ├── middleware.ts    # DevTools + persistence
│   │   │   ├── devtools-config.ts  # Advanced DevTools config
│   │   │   ├── slices/          # Add state slices here
│   │   │   └── *.md             # Documentation
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-theme.tsx
│   │   │   └── use-mobile.ts
│   │   ├── lib/
│   │   │   ├── auth-client.ts
│   │   │   ├── axios.ts
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── routes/
│   │   │   └── index.tsx
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts
│   │   │   └── user.schema.ts
│   │   └── test/
│   │       ├── setup.ts
│   │       └── test-utils.tsx
│   ├── docs/
│   │   └── AUTH_IMPLEMENTATION.md
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── components.json          # shadcn/ui config
│   └── eslint.config.js
│
├── compose.yml                   # Main Docker Compose (includes api/docker-compose.yml)
├── CLAUDE.md                     # This file
└── .gitignore
```

## Key Implementation Notes

### Backend

1. **Package Manager**: Use `pnpm` for backend, `npm` for frontend
2. **Database Entities**: Create `*.entity.ts` files in `src/database/entities/` - auto-loaded by TypeORM
3. **Oracle Naming**: Auth tables use Hungarian notation prefixes:
   - `CO_SEQ_*` - Sequential ID columns
   - `NO_*` - Name fields
   - `DS_*` - Description/text fields
   - `ST_*` - Status/state fields
   - `DT_*` - Date/timestamp fields
   - `IM_*` - Image/URL fields
   - `TP_*` - Type fields
4. **Auth Routes**: Better Auth auto-generates `/api/auth/*` routes
5. **Protected Routes**: All routes protected by default via `APP_GUARD` (use `@Public()` decorator for exceptions)
6. **Custom Adapter**: TypeORM adapter for Better Auth is custom-built in `adapters/typeorm/`
7. **Database Connection**: Shared `dataSource` instance used by both TypeORM and Better Auth
8. **Migrations**: Use TypeORM migrations (`pnpm migration:generate/run/revert`)

### Frontend

1. **Component Library**: Use `shadcn/ui` for UI components (`npx shadcn@latest add <component>`)
2. **Forms**: Use TanStack Form with Zod validation
3. **API Calls**: Use `authClient` from `lib/auth-client.ts` for auth, `axios` for other APIs
4. **Protected Routes**: Wrap components with `<ProtectedRoute>` component
5. **Auth State**: Access via `useAuthContext()` hook
6. **Client State**: Use Zustand store from `@/stores` for global client state
7. **Styling**: Use Tailwind utility classes, avoid custom CSS
8. **Dark Mode**: Theme toggle available via `useTheme()` hook
9. **Type Safety**: Define Zod schemas first, then infer TypeScript types

### Best Practices

- **TypeScript**: Use strict mode, no `any` types
- **Error Handling**: Use try-catch blocks and proper error messages
- **Validation**: Validate all user inputs with Zod schemas
- **Testing**: Write tests for new features
- **Documentation**: Update relevant docs when making changes
- **Code Style**: Follow ESLint/Prettier configs
- **Commits**: Use conventional commit messages

## Environment Variables

### Backend (API)

Create `.env` file in `api/` directory:

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=Farmácia Popular
APP_URL=http://localhost:3000

# Database (Oracle)
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=root
DB_PASSWORD=root
DB_SERVICE_NAME=FPAPI
DB_POOL_SIZE=10
DB_SYNCHRONIZE=false
DB_LOGGING=false

# Better Auth
SESSION_SECRET=change-this-to-a-strong-secret-in-production
BETTER_AUTH_SECRET=another-strong-secret-for-production

# Gov.br OAuth (optional, for feature/govbr-oauth branch)
FP_PROVIDER_ID=govbr
FP_CLIENT_ID=your-govbr-client-id
FP_CLIENT_SECRET=your-govbr-client-secret
FP_DISCOVERY_URL=https://sso.staging.acesso.gov.br/.well-known/openid-configuration
FP_REDIRECT_URI=http://localhost:3000/api/auth/callback/oauth
```

### Frontend

Create `.env.local` file in `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Application
VITE_ENV=dev
VITE_ENABLE_ANALYTICS=false
```

**Important**:

- Never commit `.env` or `.env.local` files
- Change default secrets in production
- Frontend env vars must be prefixed with `VITE_`
- Backend uses `process.env`, frontend uses `import.meta.env`

## Current Status & Features

### ✅ Implemented & Working

#### Backend

- ✅ **NestJS 11** application with TypeScript 5
- ✅ **Oracle Database** integration via TypeORM
- ✅ **Docker Compose** setup with Oracle XE 21c
- ✅ **Better Auth** with custom TypeORM adapter
- ✅ **Email/Password Authentication**
- ✅ **Gov.br OAuth Integration** (feature/govbr-oauth branch)
- ✅ **8 Database Entities** for Better Auth tables
- ✅ **AuthGuard** for route protection
- ✅ **Custom Decorators** (@Public, @Session, @Optional)
- ✅ **User Management** module with CRUD operations
- ✅ **Health Check** endpoints
- ✅ **Swagger API Documentation** (http://localhost:3000/api)
- ✅ **Global Validation** with class-validator
- ✅ **Exception Filters** for error handling
- ✅ **Database Migrations** support
- ✅ **ESLint 9** with flat config
- ✅ **Prettier** code formatting
- ✅ **SWC** compiler for fast builds
- ✅ **MSW** for API mocking in tests

#### Frontend

- ✅ **React 19.2+** with latest features
- ✅ **Vite 7+** dev server with HMR
- ✅ **TypeScript 5.7+** with strict mode
- ✅ **Tailwind CSS 4** with custom theme
- ✅ **shadcn/ui** component library
- ✅ **Better Auth React** client integration
- ✅ **Login Page** with email/password
- ✅ **Protected Routes** with ProtectedRoute component
- ✅ **Auth Context** for global state
- ✅ **TanStack Query** for server state
- ✅ **TanStack Form** for form management
- ✅ **Zod Validation** schemas
- ✅ **Dark Mode** theme toggle
- ✅ **Error Boundary** for error handling
- ✅ **Responsive Design** (mobile-first)
- ✅ **ESLint + Prettier** configuration
- ✅ **Vitest + React Testing Library** setup
- ✅ **Zustand** state management (minimal setup)
- ✅ **Redux DevTools** integration

### 🚧 In Progress

- 🚧 **Gov.br OAuth** complete integration and testing
- 🚧 **User Registration** page
- 🚧 **Password Recovery** flow
- 🚧 **Two-Factor Authentication** UI
- 🚧 **Organization Management** interface
- 🚧 **Admin Dashboard** for user management

### 📋 Planned Features

- [ ] User profile management
- [ ] Email verification flow
- [ ] Social login providers (Google, Facebook)
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Rate limiting
- [ ] Redis caching
- [ ] File upload functionality
- [ ] Internationalization (i18n)
- [ ] Analytics integration
- [ ] CI/CD pipeline
- [ ] Production deployment guides

## Quick Start Guide

### First Time Setup

1. **Clone and Install**

   ```bash
   # Install backend dependencies
   cd api
   pnpm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Start Database**

   ```bash
   # From project root
   docker compose up -d

   # Wait for Oracle to be ready (30-60 seconds)
   docker compose logs -f oracle
   # Look for: "DATABASE IS READY TO USE!"
   ```

3. **Configure Environment**

   ```bash
   # Backend
   cd api
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with API URL
   ```

4. **Run Migrations**

   ```bash
   cd api
   pnpm migration:run
   ```

5. **Start Development Servers**

   ```bash
   # Terminal 1 - Backend
   cd api
   pnpm start:dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api
   - Swagger Docs: http://localhost:3000/api

### Common Development Tasks

#### Add a New Backend Endpoint

```bash
cd api
# Generate a new module
nest g module features/my-feature
nest g controller features/my-feature
nest g service features/my-feature
```

#### Add a New Frontend Page

```typescript
// 1. Create page component
// frontend/src/pages/MyPage.tsx
export default function MyPage() {
  return <div>My Page</div>;
}

// 2. Add route
// frontend/src/routes/index.tsx
<Route path="/my-page" element={<MyPage />} />;
```

#### Add a UI Component

```bash
cd frontend
npx shadcn@latest add dialog
# Component added to src/components/ui/dialog.tsx
```

#### Add State to Zustand Store

```typescript
// 1. Update types
// frontend/src/stores/types.ts
export interface StoreState {
  _initialized: boolean
  count: number
  increment: () => void
  decrement: () => void
}

// 2. Update store
// frontend/src/stores/store.ts
export const useStore = create<StoreState>()(
  withMiddleware((set) => ({
    _initialized: true,
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }))
)

// 3. Use in components
import { useStore } from '@/stores'

function Counter() {
  const { count, increment, decrement } = useStore()
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

#### Create a Database Migration

```bash
cd api
# Make changes to entities in src/database/entities/
pnpm migration:generate -- src/database/migrations/MyMigration
pnpm migration:run
```

## Troubleshooting

### Common Issues

1. **Oracle Database Connection Failed**

   - Ensure Docker is running: `docker ps`
   - Check Oracle logs: `docker compose logs oracle`
   - Wait 60s for full initialization
   - Verify service name is `FPAPI` not `XE`

2. **Port Already in Use**

   - Backend (3000): Change `PORT` in `.env`
   - Frontend (3000): Change port in `vite.config.ts`
   - Oracle (1521): Stop other Oracle instances

3. **Migration Errors**

   - Ensure database is running
   - Check connection credentials
   - Revert last migration: `pnpm migration:revert`
   - Check Oracle-specific types are used

4. **Frontend Can't Connect to API**

   - Verify backend is running on correct port
   - Check `VITE_API_BASE_URL` in `.env.local`
   - Ensure CORS is enabled (development mode)
   - Check browser console for errors

5. **TypeScript Errors**

   - Backend: `cd api && pnpm install`
   - Frontend: `cd frontend && npm install`
   - Clear build cache: remove `node_modules`, reinstall
   - Check `tsconfig.json` configuration

6. **Auth Not Working**
   - Check `SESSION_SECRET` is set in backend `.env`
   - Verify cookies are enabled in browser
   - Check auth client baseURL configuration
   - Look for errors in browser Network tab

## Documentation

### Backend Documentation

- `api/README.md` - Complete API documentation
- `api/SETUP.md` - Quick setup guide
- `api/GETTING_STARTED.md` - Step-by-step tutorial
- `api/PROJECT_SUMMARY.md` - Implementation details
- `api/STATUS.md` - Current implementation status
- `api/STRUCTURE.md` - Project structure guide

### Frontend Documentation

- `frontend/README.md` - Frontend documentation
- `frontend/docs/AUTH_IMPLEMENTATION.md` - Auth implementation guide
- `frontend/AGENTS.md` - Agent development guide

### External Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Better Auth Docs](https://www.better-auth.com)
- [TypeORM Documentation](https://typeorm.io)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Zod Documentation](https://zod.dev)

## Git Workflow

### Current Branch Status

- **Main Branch**: Stable, production-ready code
- **feature/govbr-oauth**: Gov.br OAuth integration (active development)

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit frequently
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request for review
```

### Commit Message Convention

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```
