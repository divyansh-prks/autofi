# AutoFi - AI Coding Assistant Instructions

## Project Overview

AutoFi is a Next.js 15 application that automates YouTube content SEO optimization for creators. It processes video uploads, generates transcripts using Whisper, extracts keywords with AWS Comprehend, and creates optimized titles/descriptions using LLMs.

## Architecture & Key Services

### Core Data Flow

1. **Video Upload** (`/api/upload`) → S3 storage + local Whisper transcription
2. **Keyword Extraction** (`/api/extract-keywords`) → AWS Comprehend analysis with custom SEO scoring
3. **Content Generation** (`/api/generate-optimized-content`) → OpenAI/Gemini for titles/descriptions
4. **Status Tracking** → MongoDB with processing states: `uploading → transcribing → analyzing → generating → completed`

### Database Architecture (MongoDB + Mongoose)

- **User Model**: Clerk integration for auth (`src/lib/models/User.ts`)
- **Script Model**: Main entity tracking video processing pipeline (`src/lib/models/Script.ts`)
- Connection pattern: Global cache to prevent connection multiplication (`src/lib/db.ts`)

### AWS Services Integration

- **S3**: Video storage with pre-signed URLs
- **Comprehend**: Keyword extraction with custom SEO categories
- **Transcribe**: Backup transcription service (primary uses local Whisper)

## Development Patterns

### API Route Structure

```typescript
// Standard pattern for API routes
export const runtime = 'nodejs'; // Required for file processing
export const dynamic = 'force-dynamic'; // For real-time operations

// All routes use try-catch with proper error responses
try {
  // Processing logic
  return NextResponse.json({ success: true, data });
} catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

### Component Architecture

- **shadcn/ui** + **Radix UI** for base components (`src/components/ui/`)
- **Theme System**: Custom theme with scaling support (`src/app/theme.css`)
- **Layout Pattern**: Nested layouts for auth (`(auth)`) and dashboard sections
- **State Management**: Zustand for client state, server actions for mutations

### Authentication & Authorization

- **Clerk** integration with keyless development mode
- Protected routes via middleware (`src/middleware.ts`)
- Route matcher: `/dashboard(.*)` requires authentication

## Development Workflow

### Local Development

```bash
pnpm dev          # Start with Turbopack
pnpm lint:fix     # ESLint + Prettier formatting
pnpm format       # Prettier only
```

### Environment Configuration

1. Copy `env.example.txt` → `.env`
2. **Clerk**: Can start keyless, claim later via popup
3. **MongoDB**: Required for data persistence
4. **AWS**: Required for S3 uploads and Comprehend analysis
5. **OpenAI/Gemini**: Required for content generation

### Python Integration

- **Whisper**: Called via spawn for local transcription
- Temporary file handling in `/tmp` with cleanup
- Error handling for missing Python dependencies

## Code Conventions

### File Organization

- **API Routes**: Feature-based in `/api/[feature]/route.ts`
- **Components**: Domain-separated (`landing/`, `layout/`, `ui/`)
- **Models**: Single file per entity in `src/lib/models/`
- **Types**: Centralized in `src/types/index.ts`

### Error Handling

- API routes return consistent error format: `{ error: string }`
- Client components use error boundaries
- Server actions include Sentry integration

### Performance Optimizations

- **Image Optimization**: Next.js Image with remote patterns
- **Bundle Analysis**: Webpack analyzer in build
- **Font Loading**: Optimized with next/font
- **Streaming**: RSC for dashboard components

## Integration Points

### External Services

- **Clerk**: User authentication and management
- **AWS SDK v3**: S3, Comprehend, Transcribe clients
- **OpenAI/Gemini**: Content generation APIs
- **Sentry**: Error tracking and performance monitoring

### YouTube SEO Logic

- **Keyword Categories**: Educational, entertainment, technical (see `/api/extract-keywords`)
- **Scoring Algorithm**: Relevance × trend × category multipliers
- **Content Templates**: Title/description patterns optimized for engagement

## Testing & Deployment

### Quality Gates

- **ESLint**: Strict configuration with max warnings = 0
- **Prettier**: Enforced formatting with Tailwind plugin
- **Husky**: Pre-commit hooks for linting/formatting
- **TypeScript**: Strict mode enabled

### Build Process

- **Production**: `pnpm build` with static optimization
- **Preview**: `pnpm start` for production simulation
- **Sentry**: Source maps uploaded in CI only

## Common Tasks

When implementing new features:

1. **API Routes**: Follow the runtime/dynamic pattern, add proper error handling
2. **Database**: Extend existing models or create new ones in `src/lib/models/`
3. **UI**: Use shadcn components, follow theme system conventions
4. **Auth**: Add route protection in middleware for sensitive endpoints
5. **Testing**: Validate with realistic video files and AWS services
