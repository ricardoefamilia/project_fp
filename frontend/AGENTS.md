# AI Agent Guide - React Frontend Application

> **Purpose**: This document provides comprehensive guidance for AI agents working on this React frontend application. It explains the architecture, patterns, conventions, and decision-making framework to ensure consistent, high-quality contributions.

---

## Table of Contents
1. [Application Overview](#application-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Patterns](#architecture--patterns)
4. [Project Structure](#project-structure)
5. [Coding Conventions](#coding-conventions)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Form Handling](#form-handling)
9. [Validation Strategy](#validation-strategy)
10. [Styling Guidelines](#styling-guidelines)
11. [Component Patterns](#component-patterns)
12. [Routing Strategy](#routing-strategy)
13. [Common Tasks](#common-tasks)
14. [Troubleshooting](#troubleshooting)
15. [Decision Framework](#decision-framework)

---

## Application Overview

### What This Application Is
This is a modern, type-safe React single-page application (SPA) built with:
- **Vite 7+** for blazing-fast development and optimized builds
- **TypeScript** for compile-time type safety
- **React 19+** with modern patterns (hooks, suspense, concurrent features)
- **Tailwind CSS 4+** for utility-first styling
- **shadcn/ui** for high-quality, accessible components

### Core Principles
1. **Type Safety First**: Leverage TypeScript and Zod for end-to-end type safety
2. **Developer Experience**: Fast HMR, excellent tooling, clear error messages
3. **Performance**: Code splitting, lazy loading, optimized bundles
4. **Accessibility**: WCAG 2.1 AA compliance through shadcn/ui and Radix primitives
5. **Maintainability**: Clear patterns, consistent conventions, self-documenting code

### Key Characteristics
- **Single Page Application (SPA)**: Client-side routing with react-router
- **RESTful API Integration**: Axios-based HTTP client with interceptors
- **Server State Management**: TanStack Query for caching and synchronization
- **Form Management**: TanStack Form with Zod validation
- **Component Library**: shadcn/ui (copy-paste components, fully customizable)

---

## Technology Stack

### Core Dependencies

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| **Vite** | 7+ | Build tool | Lightning-fast HMR, optimized builds |
| **React** | 19.2+ | UI library | Concurrent features, automatic batching |
| **TypeScript** | 5.7+ | Type system | Strict mode enabled |
| **react-router** | 7+ | Routing | Client-side navigation |
| **@tanstack/react-query** | 5+ | Server state | Caching, refetching, optimistic updates |
| **@tanstack/react-form** | Latest | Form management | Type-safe, headless forms |
| **axios** | 1.7+ | HTTP client | Request/response interceptors |
| **zod** | 3.24+ | Validation | Runtime validation, type inference |
| **Tailwind CSS** | 4+ | Styling | Utility-first CSS framework |
| **shadcn/ui** | Latest | UI components | Radix UI primitives, fully customizable |

### Development Tools

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **ESLint** | Linting | Flat config with TypeScript type-aware rules |
| **Prettier** | Formatting | Single quotes, no semicolons, 80 char width |
| **typescript-eslint** | TS Linting | Strict type checking, import sorting |

---

## Architecture & Patterns

### Architectural Layers

```
┌─────────────────────────────────────────────┐
│              UI Layer (Pages)                │
│  - Route components                          │
│  - Layout components                         │
│  - Page-specific logic                       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Component Layer (Components)         │
│  - Reusable UI components                    │
│  - Business logic components                 │
│  - shadcn/ui components                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Logic Layer (Hooks)                 │
│  - Custom React hooks                        │
│  - Shared business logic                     │
│  - State management hooks                    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Data Layer (API/Query)               │
│  - API calls (axios)                         │
│  - React Query hooks                         │
│  - Data transformation                       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     Utility Layer (Lib/Utils)                │
│  - Helper functions                          │
│  - Constants                                 │
│  - Type definitions                          │
└─────────────────────────────────────────────┘
```

### Design Patterns Used

#### 1. Container/Presenter Pattern
Separate logic from presentation:

```typescript
// Container (handles logic)
function UserProfileContainer() {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`),
  })
  
  if (isLoading) return <Spinner />
  return <UserProfile user={data} />
}

// Presenter (pure UI)
function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

#### 2. Custom Hooks Pattern
Encapsulate reusable logic:

```typescript
// hooks/useUser.ts
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`)
      return userSchema.parse(data)
    },
  })
}
```

#### 3. Compound Component Pattern
For complex, composable components:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

#### 4. Provider Pattern
For context and configuration:

```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

---

## Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── forms/                   # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   └── UserForm.tsx
│   │   └── shared/                  # Shared/common components
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ...
│   │
│   ├── pages/                       # Page components (route components)
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/                      # Route configuration
│   │   ├── index.tsx                # Main route definitions
│   │   ├── ProtectedRoute.tsx       # Auth guards
│   │   └── routes.config.ts         # Route constants
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useUser.ts               # User data hook
│   │   ├── useDebounce.ts           # Utility hook
│   │   └── ...
│   │
│   ├── lib/                         # Core utilities and configuration
│   │   ├── api.ts                   # Axios instance & interceptors
│   │   ├── queryClient.ts           # React Query configuration
│   │   ├── utils.ts                 # Utility functions (cn, etc.)
│   │   └── constants.ts             # App-wide constants
│   │
│   ├── services/                    # API service functions
│   │   ├── auth.service.ts          # Auth API calls
│   │   ├── user.service.ts          # User API calls
│   │   └── ...
│   │
│   ├── schemas/                     # Zod validation schemas
│   │   ├── auth.schema.ts           # Auth-related schemas
│   │   ├── user.schema.ts           # User schemas
│   │   └── common.schema.ts         # Shared schemas
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── api.types.ts             # API response types
│   │   ├── auth.types.ts            # Auth types
│   │   └── index.ts                 # Type exports
│   │
│   ├── stores/                      # Client state management (if needed)
│   │   └── useStore.ts              # Zustand/Context stores
│   │
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   ├── app.css                      # Global styles (Tailwind imports)
│   └── vite-env.d.ts                # Vite type declarations
│
├── .env.example                     # Example environment variables
├── .env.local                       # Local environment (gitignored)
├── .gitignore                       # Git ignore rules
├── .prettierrc.json                 # Prettier configuration
├── .prettierignore                  # Prettier ignore rules
├── components.json                  # shadcn/ui configuration
├── eslint.config.js                 # ESLint flat config
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # Base TypeScript config
├── tsconfig.app.json                # App TypeScript config
├── tsconfig.node.json               # Node TypeScript config
├── vite.config.ts                   # Vite configuration
└── README.md                        # Project documentation
```

### Directory Purposes

| Directory | Purpose | Guidelines |
|-----------|---------|------------|
| `components/ui/` | shadcn/ui components | ❌ Don't modify directly, regenerate with CLI |
| `components/layout/` | Layout components | Header, Footer, Sidebar, etc. |
| `components/forms/` | Form components | Self-contained form components |
| `components/shared/` | Reusable components | Used across multiple pages |
| `pages/` | Route components | One component per route |
| `hooks/` | Custom hooks | Prefix with `use`, one hook per file |
| `lib/` | Core utilities | Configuration, helpers, constants |
| `services/` | API services | Organized by resource/domain |
| `schemas/` | Zod schemas | Validation + type inference |
| `types/` | Type definitions | Shared TypeScript types |

---

## Coding Conventions

### File Naming

| File Type | Convention | Example |
|-----------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `User.types.ts` |
| Schemas | camelCase | `user.schema.ts` |
| Services | camelCase | `auth.service.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |

### Import Organization

Always organize imports in this order:

```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 2. Internal utilities and hooks
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

// 3. Components (UI, then custom)
import { Button } from '@/components/ui/button'
import { UserCard } from '@/components/shared/UserCard'

// 4. Types and schemas
import type { User } from '@/types'
import { userSchema } from '@/schemas/user.schema'

// 5. Styles (if any)
import './styles.css'
```

### TypeScript Guidelines

#### ✅ DO

```typescript
// Use type imports for type-only imports
import type { User } from '@/types'

// Infer types from Zod schemas
const userSchema = z.object({ name: z.string() })
type User = z.infer<typeof userSchema>

// Use const assertions for readonly values
const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
} as const

// Use discriminated unions
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Use generics for reusable types
function useResource<T>(url: string): QueryResult<T>

// Use unknown instead of any
function handleError(error: unknown) {
  if (error instanceof Error) {
    // handle
  }
}
```

#### ❌ DON'T

```typescript
// Don't use any
function getData(): any // ❌

// Don't use non-null assertion unless absolutely necessary
const user = data! // ❌ (prefer optional chaining)

// Don't skip type annotations for public APIs
export function process(data) // ❌ (add types)

// Don't use loose equality
if (value == null) // ❌ (use === or nullish coalescing)
```

### React Component Guidelines

#### Preferred Component Structure

```typescript
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// Props type definition
interface UserCardProps {
  user: User
  onEdit?: () => void
  className?: string
}

// Component with proper typing
export function UserCard({ user, onEdit, className }: UserCardProps) {
  // 1. Hooks at the top
  const [isEditing, setIsEditing] = useState(false)
  
  // 2. Derived state and computations
  const displayName = user.firstName + ' ' + user.lastName
  
  // 3. Event handlers
  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.()
  }
  
  // 4. Early returns for loading/error states
  if (!user) return null
  
  // 5. Main render
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h3>{displayName}</h3>
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  )
}
```

### Comment Guidelines

```typescript
// ✅ Good: Explain WHY, not WHAT
// Debounce search to avoid excessive API calls during typing
const debouncedSearch = useDebounce(searchTerm, 500)

// ✅ Good: Document complex logic
// Use exponential backoff for retries to avoid overwhelming the server
const retryDelay = Math.min(1000 * Math.pow(2, attempt), 10000)

// ❌ Bad: Obvious comments
// Set the user variable
const user = data.user

// ✅ Good: TODO with context
// TODO: Implement pagination once API supports cursor-based pagination (ticket #123)

// ✅ Good: API documentation
/**
 * Formats a date string for display
 * @param date - ISO 8601 date string
 * @param format - Display format (default: 'short')
 * @returns Formatted date string
 */
export function formatDate(date: string, format = 'short'): string
```

---

## State Management

### State Management Strategy

This application uses a hybrid state management approach:

#### 1. Server State (TanStack Query)
Use for **all data from the backend**:

```typescript
// ✅ Server state (data from API)
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const { data } = await api.get('/users')
    return z.array(userSchema).parse(data)
  },
})
```

**When to use**:
- Data fetched from API
- Cacheable data
- Data that needs revalidation
- Data shared across components

**Key patterns**:
```typescript
// Query pattern
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['resource', id], // Unique key
  queryFn: fetchFunction,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
})

// Mutation pattern
const mutation = useMutation({
  mutationFn: (data) => api.post('/users', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})

// Optimistic update pattern
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ['users'] })
    const previous = queryClient.getQueryData(['users'])
    queryClient.setQueryData(['users'], (old) => [...old, newUser])
    return { previous }
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(['users'], context.previous)
  },
})
```

#### 2. Local UI State (useState/useReducer)
Use for **component-specific UI state**:

```typescript
// ✅ Local UI state
const [isOpen, setIsOpen] = useState(false)
const [activeTab, setActiveTab] = useState('profile')
```

**When to use**:
- Modal open/closed state
- Form input values (when not using TanStack Form)
- Accordion expanded state
- Active tab selection
- Temporary UI flags

#### 3. URL State (react-router)
Use for **shareable, bookmarkable state**:

```typescript
// ✅ URL state
const [searchParams] = useSearchParams()
const page = searchParams.get('page') || '1'
const filter = searchParams.get('filter') || 'all'
```

**When to use**:
- Pagination parameters
- Search queries
- Filter selections
- Sort order
- Active view/tab (when shareable)

#### 4. Global Client State (Context/Zustand)
Use **sparingly** for truly global client state:

```typescript
// ✅ Global client state (rare)
const { theme, setTheme } = useTheme()
const { user, setUser } = useAuth()
```

**When to use**:
- Theme preference
- Authentication state
- User preferences
- Feature flags

### State Selection Matrix

| State Type | Storage | Persistence | Example |
|------------|---------|-------------|---------|
| Server data | React Query | Cache (5-10 min) | User list, posts |
| Form state | TanStack Form | None | Input values, validation |
| UI state | useState | None | Modal open, tab active |
| URL state | react-router | URL | Page, filters, search |
| Global state | Context/Zustand | localStorage | Theme, auth token |

---

## API Integration

### Axios Configuration

The Axios instance (`src/lib/api.ts`) is pre-configured with:

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - adds auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Service Layer Pattern

Organize API calls by resource in the `services/` directory:

```typescript
// services/user.service.ts
import api from '@/lib/api'
import { userSchema, createUserSchema } from '@/schemas/user.schema'
import type { User, CreateUserInput } from '@/schemas/user.schema'

export const userService = {
  // GET /users
  async getUsers(): Promise<User[]> {
    const { data } = await api.get('/users')
    return z.array(userSchema).parse(data)
  },

  // GET /users/:id
  async getUser(id: string): Promise<User> {
    const { data } = await api.get(`/users/${id}`)
    return userSchema.parse(data)
  },

  // POST /users
  async createUser(input: CreateUserInput): Promise<User> {
    const validated = createUserSchema.parse(input)
    const { data } = await api.post('/users', validated)
    return userSchema.parse(data)
  },

  // PUT /users/:id
  async updateUser(id: string, input: Partial<CreateUserInput>): Promise<User> {
    const { data } = await api.put(`/users/${id}`, input)
    return userSchema.parse(data)
  },

  // DELETE /users/:id
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
```

### Query Hooks Pattern

Create custom hooks that combine services with React Query:

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import type { CreateUserInput } from '@/schemas/user.schema'

// Query key factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Get all users
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getUsers,
  })
}

// Get single user
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id, // Only fetch if id exists
  })
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (input: CreateUserInput) => userService.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
```

### Error Handling Pattern

```typescript
// In components
function UserList() {
  const { data, isLoading, error } = useUsers()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load users'}
        </AlertDescription>
      </Alert>
    )
  }
  
  return <UserTable users={data} />
}
```

---

## Form Handling

### TanStack Form with Zod

This application uses TanStack Form for type-safe, performant form management:

```typescript
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 1. Define schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

// 2. Create form component
export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginSchema, // Validate on change
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value)
      } catch (error) {
        // Handle error
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      {/* Email field */}
      <form.Field
        name="email"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />

      {/* Password field */}
      <form.Field
        name="password"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      />

      <Button type="submit" className="mt-4">
        Sign In
      </Button>
    </form>
  )
}
```

### Form Best Practices

#### ✅ DO
- Use Zod schemas for validation
- Show validation errors inline
- Disable submit button during submission
- Show loading state on button
- Clear form after successful submission
- Handle API errors gracefully
- Use proper HTML input types
- Add proper labels for accessibility

#### ❌ DON'T
- Validate on every keystroke (use onChange or onBlur)
- Submit forms without validation
- Forget to handle loading and error states
- Use generic error messages
- Allow double submission

---

## Validation Strategy

### Zod Schema Organization

```typescript
// schemas/user.schema.ts
import { z } from 'zod'

// Base user schema (from API)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Infer TypeScript type
export type User = z.infer<typeof userSchema>

// Create user schema (omit server-generated fields)
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// Update user schema (all fields optional)
export const updateUserSchema = createUserSchema.partial()

export type UpdateUserInput = z.infer<typeof updateUserSchema>

// Login schema (different shape)
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>
```

### Common Zod Patterns

```typescript
// Email validation
z.string().email()

// URL validation
z.string().url()

// UUID validation
z.string().uuid()

// Date validation
z.string().datetime() // ISO 8601
z.date() // JavaScript Date object

// Number constraints
z.number().min(0).max(100)
z.number().int().positive()

// String constraints
z.string().min(1).max(255)
z.string().regex(/^[A-Z0-9]+$/)

// Enums
z.enum(['option1', 'option2'])
z.nativeEnum(MyEnum)

// Arrays
z.array(z.string())
z.array(userSchema).min(1)

// Objects
z.object({ key: z.string() })

// Optional fields
z.string().optional()
z.string().nullable()
z.string().nullish() // null | undefined

// Default values
z.string().default('default')

// Transforms
z.string().transform((val) => val.trim())

// Refinements (custom validation)
z.string().refine(
  (val) => val !== 'forbidden',
  { message: 'This value is not allowed' }
)

// Discriminated unions
z.discriminatedUnion('type', [
  z.object({ type: z.literal('success'), data: z.string() }),
  z.object({ type: z.literal('error'), error: z.string() }),
])
```

---

## Styling Guidelines

### Tailwind CSS Patterns

#### Utility Class Usage

```typescript
// ✅ Good: Use Tailwind utilities
<div className="flex items-center justify-between p-4 rounded-lg border">

// ✅ Good: Use cn() for conditional classes
<div className={cn(
  'rounded-lg border p-4',
  isActive && 'bg-primary text-primary-foreground',
  className // Always accept className prop
)}>

// ❌ Bad: Inline styles (use only when absolutely necessary)
<div style={{ padding: '16px' }}>
```

#### Component Styling Patterns

```typescript
// Pattern 1: Base + Variants
function Button({ variant = 'default', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Variants
        {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          outline: 'border border-input bg-background hover:bg-accent',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
        }[variant],
        
        // Sizes
        {
          sm: 'h-9 px-3 text-sm',
          md: 'h-10 px-4 py-2',
          lg: 'h-11 px-8 text-lg',
        }[size],
        
        // Custom classes
        className
      )}
      {...props}
    />
  )
}
```

#### Responsive Design

```typescript
// Mobile-first approach
<div className="
  flex flex-col           // Mobile: stack vertically
  md:flex-row            // Tablet: horizontal
  gap-4                  // Always 1rem gap
  p-4 md:p-6 lg:p-8      // Responsive padding
">
```

#### Dark Mode Support

```typescript
// Use Tailwind's dark: variant (shadcn/ui handles theme)
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">

// Use CSS variables (preferred for shadcn/ui)
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
```

### shadcn/ui Component Customization

```typescript
// Installing components
// npx shadcn@latest add button

// Customizing in components/ui/button.tsx
// ✅ Modify the component file directly
export function Button({ className, variant, ...props }) {
  // Add custom variants or modify existing ones
}

// Using customized components
import { Button } from '@/components/ui/button'

<Button variant="default">Click me</Button>
<Button variant="outline" size="lg">Large</Button>
```

---

## Component Patterns

### Composition Pattern

```typescript
// Parent component
export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <UserCardHeader user={user} />
      <UserCardContent user={user} />
      <UserCardFooter user={user} />
    </Card>
  )
}

// Child components
function UserCardHeader({ user }: { user: User }) {
  return (
    <CardHeader>
      <CardTitle>{user.name}</CardTitle>
      <CardDescription>{user.email}</CardDescription>
    </CardHeader>
  )
}
```

### Render Props Pattern

```typescript
interface DataLoaderProps<T> {
  queryKey: QueryKey
  queryFn: () => Promise<T>
  children: (data: T) => React.ReactNode
}

function DataLoader<T>({ queryKey, queryFn, children }: DataLoaderProps<T>) {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn })
  
  if (isLoading) return <Spinner />
  if (error) return <ErrorAlert error={error} />
  if (!data) return null
  
  return <>{children(data)}</>
}

// Usage
<DataLoader queryKey={['user']} queryFn={fetchUser}>
  {(user) => <UserProfile user={user} />}
</DataLoader>
```

### Higher-Order Component (HOC) Pattern

```typescript
// Use sparingly, prefer hooks
function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    
    if (isLoading) return <Spinner />
    if (!user) return <Navigate to="/login" />
    
    return <Component {...props} />
  }
}

// Usage
const ProtectedDashboard = withAuth(Dashboard)
```

---

## Routing Strategy

### Route Configuration

```typescript
// routes/index.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* Nested routes */}
        <Route path="/users">
          <Route index element={<UserListPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/edit" element={<UserEditPage />} />
          <Route path="new" element={<UserCreatePage />} />
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
```

### Protected Routes

```typescript
// routes/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    // Redirect to login, save attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return <>{children}</>
}
```

### Navigation Helpers

```typescript
// routes/routes.config.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_EDIT: (id: string) => `/users/${id}/edit`,
} as const

// Usage
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'

function Component() {
  const navigate = useNavigate()
  
  const goToUser = (id: string) => {
    navigate(ROUTES.USER_DETAIL(id))
  }
}
```

---

## Common Tasks

### Adding a New Feature

1. **Create schema** in `schemas/`
   ```typescript
   // schemas/product.schema.ts
   export const productSchema = z.object({ ... })
   export type Product = z.infer<typeof productSchema>
   ```

2. **Create service** in `services/`
   ```typescript
   // services/product.service.ts
   export const productService = {
     async getProducts() { ... },
     async getProduct(id) { ... },
   }
   ```

3. **Create hooks** in `hooks/`
   ```typescript
   // hooks/useProducts.ts
   export function useProducts() {
     return useQuery({ ... })
   }
   ```

4. **Create components** in `components/`
   ```typescript
   // components/ProductCard.tsx
   export function ProductCard({ product }) { ... }
   ```

5. **Create page** in `pages/`
   ```typescript
   // pages/ProductsPage.tsx
   export default function ProductsPage() { ... }
   ```

6. **Add route** in `routes/index.tsx`
   ```typescript
   <Route path="/products" element={<ProductsPage />} />
   ```

### Adding a shadcn/ui Component

```bash
# Add a component
npx shadcn@latest add dialog

# Component will be added to components/ui/dialog.tsx
# Import and use:
import { Dialog, DialogContent } from '@/components/ui/dialog'
```

### Creating a Custom Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
```

### Implementing Authentication

```typescript
// hooks/useAuth.ts
import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@/types'
import { authService } from '@/services/auth.service'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token')
    if (token) {
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password)
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## Troubleshooting

### Common Issues

#### Issue: TypeScript errors in `vite.config.ts`

```typescript
// Solution: Install @types/node
npm install -D @types/node

// Add to tsconfig.node.json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

#### Issue: Import alias `@/` not working

```typescript
// Check vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}

// Check tsconfig.json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

#### Issue: Tailwind classes not applying

```css
/* Check src/app.css */
@import 'tailwindcss';

/* Check vite.config.ts includes Tailwind plugin */
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

#### Issue: React Query devtools not showing

```typescript
// Add to App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

#### Issue: Form validation not working

```typescript
// Ensure zodValidator is imported and used
import { zodValidator } from '@tanstack/zod-form-adapter'

const form = useForm({
  validatorAdapter: zodValidator(),
  validators: {
    onChange: yourSchema, // or onBlur
  },
})
```

### Performance Issues

#### Slow development server
- Check for circular dependencies
- Reduce the number of large dependencies
- Use lazy loading for routes
- Clear node_modules and reinstall

#### Large bundle size
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Solutions:
# - Lazy load routes and heavy components
# - Use dynamic imports
# - Tree-shake unused code
# - Consider code splitting
```

---

## Decision Framework

### When to Create a New Component

✅ **Create a new component if**:
- Logic is reused in 2+ places
- Component exceeds ~150 lines
- Functionality is self-contained
- Testing would be easier in isolation

❌ **Don't create a component if**:
- Used only once
- Tightly coupled to parent
- Would require excessive prop drilling
- Adds unnecessary abstraction

### When to Create a Custom Hook

✅ **Create a custom hook if**:
- Logic is reused in 2+ components
- Contains stateful logic
- Combines multiple hooks
- Improves readability

❌ **Don't create a hook if**:
- Logic is stateless (use utility function)
- Used only once
- Doesn't follow hooks rules

### When to Use Context vs Props

**Use Props** (default):
- 1-2 levels of nesting
- Type safety is important
- Component composition is possible

**Use Context** (sparingly):
- 3+ levels of prop drilling
- Truly global state (theme, auth)
- Performance isn't critical

### When to Optimize Performance

**Optimize if**:
- Measured performance issue exists
- Component renders > 100 times/second
- Large lists (1000+ items)
- Expensive computations

**Don't optimize prematurely**:
- No measured performance issue
- Reduces code readability
- Adds unnecessary complexity

---

## Summary Checklist

When working on this codebase, always:

- ✅ Use TypeScript strictly (no `any`)
- ✅ Validate with Zod, infer types
- ✅ Use React Query for server state
- ✅ Use TanStack Form for forms
- ✅ Follow file naming conventions
- ✅ Import shadcn/ui components, don't recreate
- ✅ Use Tailwind utilities, avoid inline styles
- ✅ Create custom hooks for reusable logic
- ✅ Organize imports consistently
- ✅ Handle loading and error states
- ✅ Write accessible HTML
- ✅ Test with ESLint and Prettier
- ✅ Use lazy loading for routes
- ✅ Keep components focused and small
- ✅ Document complex logic with comments

---

## Questions & Clarifications

If you're unsure about:

1. **Where to put a file?** → Check [Project Structure](#project-structure)
2. **How to fetch data?** → Check [API Integration](#api-integration)
3. **How to handle forms?** → Check [Form Handling](#form-handling)
4. **How to style components?** → Check [Styling Guidelines](#styling-guidelines)
5. **How to manage state?** → Check [State Management](#state-management)
6. **How to add a route?** → Check [Routing Strategy](#routing-strategy)
7. **What pattern to use?** → Check [Decision Framework](#decision-framework)

---

## Version Information

- **Document Version**: 1.0.0
- **Last Updated**: 2025-01-11
- **Vite Version**: 7+
- **React Version**: 19.2+
- **TypeScript Version**: 5.7+
- **Tailwind CSS Version**: 4+

---

**For AI Agents**: This document represents the single source of truth for this React application. When in doubt, refer to this guide. When patterns are unclear, ask for clarification rather than inventing new patterns. Consistency is key to maintainability.

