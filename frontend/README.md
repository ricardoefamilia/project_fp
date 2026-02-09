# Frontend Application

> A modern, type-safe React application built with Vite, TypeScript, and Tailwind CSS

[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7+-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## 🎯 About

This is a production-ready React single-page application (SPA) featuring modern development practices and cutting-edge tools. Built with **Vite 7+** for lightning-fast development, **React 19+** for the latest React features, and **Tailwind CSS 4** for beautiful, responsive UI design.

### Key Highlights

- ⚡ **Blazing Fast**: Powered by Vite with instant HMR
- 🎨 **Modern UI**: shadcn/ui components with Tailwind CSS 4
- 🔒 **Type-Safe**: End-to-end TypeScript with strict mode
- 📝 **Form Management**: TanStack Form with Zod validation
- 🔄 **Server State**: TanStack Query for efficient data fetching
- 🎭 **Accessible**: WCAG 2.1 AA compliant components
- 📱 **Responsive**: Mobile-first design approach
- 🌙 **Dark Mode**: Built-in theme switching

---

## ✨ Features

- **Authentication & Authorization**: JWT-based auth with protected routes
- **Form Handling**: Type-safe forms with real-time validation
- **API Integration**: Axios-based HTTP client with interceptors
- **State Management**: Hybrid approach (Server state + Local state + URL state)
- **Code Splitting**: Lazy loading for optimal performance
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Developer Experience**: ESLint, Prettier, TypeScript, and hot reload
- **Testing Ready**: Vitest and React Testing Library integration

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 22.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.0.0 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))

### Verify Installation

```bash
node --version  # Should be v20.0.0 or higher
npm --version   # Should be 10.0.0 or higher
git --version   # Should be 2.0.0 or higher
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React, React Router, and React DOM
- Vite and build tools
- TanStack Query and TanStack Form
- Axios for HTTP requests
- Zod for validation
- Tailwind CSS and shadcn/ui
- TypeScript and type definitions
- ESLint and Prettier

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
VITE_ENV=dev
VITE_API_BASE_URL=http://localhost:8000
VITE_ENABLE_ANALYTICS=false
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## 🎮 Available Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint to check for code issues |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted correctly |
| `npm run type-check` | Run TypeScript compiler to check types |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once (for CI/CD) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI for interactive testing |

### Maintenance

| Command | Description |
|---------|-------------|
| `npm run clean` | Remove node_modules and reinstall |
| `npm run bundle-analyze` | Analyze production bundle size |

### shadcn/ui Components

| Command | Description |
|---------|-------------|
| `npx shadcn@latest add <component>` | Add a new shadcn/ui component |
| `npx shadcn@latest add` | Interactive component selection |

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

---

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets (favicon, robots.txt)
├── src/
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui components (auto-generated)
│   │   ├── layout/                  # Layout components (Header, Footer)
│   │   ├── forms/                   # Form components
│   │   └── shared/                  # Shared/reusable components
│   ├── pages/                       # Page components (routes)
│   ├── routes/                      # Route configuration
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Core utilities and config
│   ├── services/                    # API service functions
│   ├── schemas/                     # Zod validation schemas
│   ├── types/                       # TypeScript type definitions
│   ├── stores/                      # Global state
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Application entry point
│   └── app.css                      # Global styles
├── .env.example                     # Example environment variables
├── .env.local                       # Local environment (gitignored)
├── components.json                  # shadcn/ui configuration
├── eslint.config.js                 # ESLint configuration
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

### Key Directories

- **`components/ui/`**: Pre-built shadcn/ui components (don't modify directly)
- **`components/shared/`**: Custom reusable components used across pages
- **`pages/`**: One component per route (HomePage, DashboardPage, etc.)
- **`hooks/`**: Custom React hooks (useAuth, useUser, etc.)
- **`services/`**: API calls organized by resource (auth.service.ts, user.service.ts)
- **`schemas/`**: Zod schemas for validation and type inference

---

## 🔐 Environment Variables

Environment variables are prefixed with `VITE_` to be accessible in the browser.

### Available Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_ENV` | Application environment | `dev` | No |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` | Yes |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` | No |

### Usage in Code

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_BASE_URL

// Check environment
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD
```

or 

```typescript
// Import env type 
import { env } from '@/env'

// Current env value
env.VITE_API_BASE_URL
```

---

## 💻 Development Workflow

### Daily Development

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   npm install  # If dependencies changed
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Make Changes**
   - Edit files in `src/`
   - Changes will hot-reload automatically
   - Check console for errors

4. **Run Quality Checks**
   ```bash
   npm run lint          # Check for linting errors
   npm run type-check    # Check TypeScript types
   npm run format:check  # Check formatting
   ```

5. **Fix Issues Automatically**
   ```bash
   npm run lint:fix   # Fix linting issues
   npm run format     # Format code
   ```

6. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin your-branch
   ```

### Adding a New Feature

1. **Create Schema** (if needed)
   ```typescript
   // src/schemas/product.schema.ts
   export const productSchema = z.object({
     id: z.string().uuid(),
     name: z.string().min(1),
     price: z.number().positive(),
   })
   
   export type Product = z.infer<typeof productSchema>
   ```

2. **Create Service**
   ```typescript
   // src/services/product.service.ts
   export const productService = {
     async getProducts(): Promise<Product[]> {
       const { data } = await api.get('/products')
       return z.array(productSchema).parse(data)
     },
   }
   ```

3. **Create Hook**
   ```typescript
   // src/hooks/useProducts.ts
   export function useProducts() {
     return useQuery({
       queryKey: ['products'],
       queryFn: productService.getProducts,
     })
   }
   ```

4. **Create Component**
   ```typescript
   // src/components/ProductCard.tsx
   export function ProductCard({ product }: { product: Product }) {
     return <Card>...</Card>
   }
   ```

5. **Create Page**
   ```typescript
   // src/pages/ProductsPage.tsx
   export default function ProductsPage() {
     const { data, isLoading } = useProducts()
     return <div>...</div>
   }
   ```

6. **Add Route**
   ```typescript
   // src/routes/index.tsx
   <Route path="/products" element={<ProductsPage />} />
   ```

---

## ✅ Code Quality

### ESLint

ESLint is configured with TypeScript-aware rules:

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Prettier

Prettier ensures consistent code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### TypeScript

Strict TypeScript checking is enabled:

```bash
# Type check
npm run type-check
```

---

## 🧪 Testing

### Run Tests

```bash
# Watch mode (recommended during development)
npm run test

# Run once
npm run test:ci

# With coverage
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Writing Tests

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

---

## 🏗️ Building for Production

### Create Production Build

```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Bundle and optimize code
3. Output to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

Access the preview at: **http://localhost:4173**

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js      # Main JavaScript bundle
│   ├── index-[hash].css     # Compiled CSS
│   └── [asset]-[hash].*     # Optimized assets
├── index.html               # Entry HTML file
└── vite.svg                 # Static assets
```

### Analyze Bundle Size

```bash
npm run build
npx vite-bundle-visualizer
```

---

## 🚀 Deployment

### Deploy with Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t frontend .
docker run -p 80:80 frontend
```

---

## 🛠️ Technologies Used

### Core

- **[React 19.2+](https://react.dev/)** - UI library with concurrent features
- **[TypeScript 5.7+](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite 7+](https://vite.dev/)** - Next-generation build tool

### Routing & State

- **[React Router 7+](https://reactrouter.com/)** - Client-side routing
- **[TanStack Query 5+](https://tanstack.com/query/latest)** - Server state management
- **[TanStack Form](https://tanstack.com/form/latest)** - Type-safe form handling

### Data & Validation

- **[Axios 1.7+](https://axios-http.com/)** - HTTP client
- **[Zod 3.24+](https://zod.dev/)** - Schema validation

### Styling & UI

- **[Tailwind CSS 4+](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components

### Code Quality

- **[ESLint 9+](https://eslint.org/)** - Linting
- **[Prettier 3+](https://prettier.io/)** - Code formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TS linting rules

### Testing

- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - React component testing
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM implementation

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Code Style

- Follow existing patterns and conventions
- Use TypeScript strictly (no `any` types)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve form validation issue"
git commit -m "docs: update README with new commands"
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Run quality checks

3. **Ensure quality**
   ```bash
   npm run lint
   npm run type-check
   npm run format
   npm run test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feat/your-feature-name
   ```

5. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Wait for review

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Error: Port 3000 is already in use
# Solution: Kill the process or use a different port
lsof -ti:3000 | xargs kill -9
# Or change port in vite.config.ts
```

#### Module Not Found

```bash
# Error: Cannot find module '@/...'
# Solution: Check tsconfig.json paths configuration
npm install  # Reinstall dependencies
```

#### Build Fails

```bash
# Solution: Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### TypeScript Errors

```bash
# Solution: Ensure all dependencies are installed
npm install
npm run type-check
```

#### Tailwind CSS Not Working

```bash
# Solution: Verify Vite plugin is configured
# Check vite.config.ts has:
# import tailwindcss from '@tailwindcss/vite'
# plugins: [react(), tailwindcss()]
```

### Getting Help

- **Documentation**: Check the [AGENTS.md](./AGENTS.md) for detailed guidance
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Team**: Reach out to team members on Slack/Discord

---

## 📚 Resources

### Official Documentation

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vite.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Form](https://tanstack.com/form/latest/docs/overview)
- [Zod Documentation](https://zod.dev/)

### Learning Resources

- [React Tutorial](https://react.dev/learn)
- [TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

### Tools

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TanStack Query DevTools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀**

