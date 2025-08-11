# Environment Configuration

This document explains how to set up environment variables for the LNE Frontend Admin project.

## Environment Files

The project uses multiple environment files for different environments:

- `.env.example` - Template file with all available environment variables
- `.env.local` - Local development environment (not committed to git)
- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

## Required Environment Variables

### `NEXT_PUBLIC_BASE_URL`

The base URL for your API endpoints.

**Development:**

```
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

**Production:**

```
NEXT_PUBLIC_BASE_URL=https://api.yourdomain.com
```

## Optional Environment Variables

### Analytics and Monitoring

- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking

### External Services

- `NEXT_PUBLIC_API_KEY` - API key for external services
- `DATABASE_URL` - Database connection string

### Feature Flags

- `NEXT_PUBLIC_ENABLE_FEATURE_X` - Enable/disable feature X
- `NEXT_PUBLIC_ENABLE_FEATURE_Y` - Enable/disable feature Y

## Setup Instructions

1. **Copy the example file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your values:**

   ```bash
   # API Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:8000

   # Next.js Configuration
   NODE_ENV=development
   ```

3. **For production, create `.env.production`:**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

## Environment Variable Usage

### In Components

```typescript
import { BASE_URL, IS_PRODUCTION } from '@/constants/variables';

// Use environment variables
const apiUrl = `${BASE_URL}/api/endpoint`;
```

### In Server Components

```typescript
import { getEnvVar } from '@/utils/env';

const apiKey = getEnvVar('API_KEY', true); // Required
const debugMode = getBooleanEnvVar('DEBUG_MODE', false); // Optional with default
```

## Validation

Run environment validation:

```bash
yarn env:validate
```

## Security Notes

- Never commit `.env.local`, `.env.development`, or `.env.production` to version control
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Use server-side environment variables for sensitive data
- Regularly rotate API keys and secrets

## Troubleshooting

### Environment Variables Not Loading

1. Ensure the file is named correctly (`.env.local`, `.env.development`, etc.)
2. Restart the development server after adding new variables
3. Check that variables are prefixed with `NEXT_PUBLIC_` for client-side access

### TypeScript Errors

The project includes TypeScript declarations for environment variables in `src/types/env.d.ts`. If you add new variables, update this file accordingly.
