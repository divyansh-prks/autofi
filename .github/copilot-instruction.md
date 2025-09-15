# GitHub Copilot Instructions for AutoFi

## Project Overview

AutoFi is a modern full-stack dashboard application built with Next.js 15, React 19, and TypeScript. It's a comprehensive business dashboard template featuring analytics, task management, authentication, and modern UI components.

## Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **React 19** with server components
- **TypeScript 5.7** for type safety
- **Tailwind CSS 4.0** for styling

### UI & Components
- **Shadcn/ui** for component library
- **Radix UI** for headless components
- **Tabler Icons** for iconography
- **Framer Motion** for animations
- **Recharts** for data visualization
- **TanStack Table** for data tables

### Authentication & Security
- **Clerk** for authentication (with keyless mode support)
- Protected routes with middleware

### State Management & Data
- **Zustand** for client-side state management
- **Zod** for schema validation
- **React Hook Form** for form handling
- **MongoDB/Mongoose** for database (configured but optional)

### Development & Monitoring
- **Sentry** for error tracking
- **ESLint** and **Prettier** for code quality
- **Husky** for git hooks
- **pnpm** for package management

## Project Structure

```
autofi/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── auth/               # Authentication pages (sign-in, sign-up)
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── overview/       # Analytics dashboard with parallel routes
│   │   │   ├── kanban/         # Task management
│   │   │   ├── product/        # Product management
│   │   │   └── profile/        # User profile
│   │   └── upload/             # File upload features
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── layout/             # Layout components (sidebar, header)
│   │   ├── forms/              # Form components
│   │   └── kbar/               # Command palette
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication components
│   │   ├── kanban/             # Kanban board functionality
│   │   ├── overview/           # Dashboard analytics
│   │   ├── products/           # Product management
│   │   └── profile/            # User profile management
│   ├── lib/                    # Utility libraries
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── constants/              # App constants and mock data
```

## Key Features

### 1. Dashboard Analytics
- Interactive charts (Bar, Area, Pie)
- Real-time data visualization
- Parallel routes for optimized loading
- Responsive grid layouts

### 2. Kanban Task Management
- Drag & drop functionality with dnd-kit
- Real-time state persistence
- Dynamic column management
- Task creation and editing

### 3. Authentication
- Clerk integration with keyless mode
- Protected routes middleware
- User profile management
- Social login support

### 4. Modern UI/UX
- Dark/light theme switching with multiple theme variants
- Responsive sidebar with collapsible states
- Command palette (Cmd+K) for navigation
- Loading states and skeletons
- Toast notifications

### 5. Data Management
- Mock API for development
- Type-safe data operations
- Form validation with Zod
- Data tables with sorting/filtering

## Coding Guidelines

### Component Architecture
- Use functional components with hooks
- Implement server components where possible
- Follow feature-based organization
- Use TypeScript for all components

### Styling Conventions
- Use Tailwind CSS utility classes
- Follow the design system tokens
- Implement responsive designs mobile-first
- Use CSS variables for theming

### State Management
- Use Zustand for complex client state
- Implement proper TypeScript typing
- Use React hooks for local state
- Persist important state with localStorage

### File Naming
- Use kebab-case for files and folders
- Use PascalCase for component names
- Use camelCase for functions and variables
- Use UPPER_CASE for constants

### Import Organization
```typescript
// External libraries
import React from 'react'
import { NextPage } from 'next'

// Internal components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Local components
import { LocalComponent } from './local-component'

// Types
import type { ComponentProps } from './types'
```

## Development Patterns

### Forms
- Use React Hook Form with Zod validation
- Implement proper error handling
- Follow consistent form layouts
- Use TypeScript for form data

### API Integration
- Use async/await for data fetching
- Implement proper error handling
- Use loading states
- Type API responses

### Component Creation
- Start with props interface
- Implement proper TypeScript types
- Add JSDoc comments for complex logic
- Follow accessibility guidelines

### Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Use server components when possible
- Optimize images with next/image

## Environment Setup

### Required Environment Variables
```bash
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Error Tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ORG=
NEXT_PUBLIC_SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# Database (Optional)
MONGODB_URI=
```

### Development Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

## Architecture Decisions

### Parallel Routes
The overview dashboard uses Next.js parallel routes (@bar_stats, @area_stats, @sales, @pie_stats) for optimized loading and better user experience.

### Feature-Based Organization
Code is organized by features rather than technical layers, making it easier to maintain and scale.

### Type Safety
Strong emphasis on TypeScript usage throughout the application with proper type definitions and schema validation.

### Accessibility
Components follow ARIA guidelines and include proper keyboard navigation support.

### Theming
Advanced theming system with multiple color schemes and scaling options using CSS variables and Tailwind CSS.

## Common Patterns

### Creating New Pages
1. Create route in `src/app/`
2. Add to navigation in `src/constants/data.ts`
3. Implement proper authentication if needed
4. Add breadcrumb support

### Adding New Features
1. Create feature folder in `src/features/`
2. Add components, utils, and types
3. Export from feature index
4. Integrate with navigation

### Styling Components
1. Use Tailwind utility classes
2. Follow design system tokens
3. Implement responsive design
4. Add dark mode support

Remember to maintain consistency with the existing codebase and follow the established patterns when contributing to this project.
