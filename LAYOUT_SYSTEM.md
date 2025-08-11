# Layout System

This application uses a flexible layout system with two main layouts:

## Layouts

### 1. BlankLayout
- **Purpose**: For unauthenticated pages (e.g., login page)
- **Features**: 
  - Only renders children without any header or footer
  - Clean, minimal design
  - Full-screen content area

### 2. HeaderLayout
- **Purpose**: For authenticated pages (e.g., control page, home page)
- **Features**:
  - Includes header with navigation and authentication status
  - No footer (removed as requested)
  - Main content area with proper spacing

## Components

### LayoutProvider
- **Location**: `src/components/layouts/LayoutProvider.tsx`
- **Purpose**: Determines which layout to use based on authentication status
- **Features**:
  - Automatic layout selection based on `isAuthenticated` state
  - Optional `forceLayout` prop to override automatic selection
  - Supports 'blank' and 'header' layout types

### Usage

#### Automatic Layout Selection
```tsx
// Uses HeaderLayout if authenticated, BlankLayout if not
<LayoutProvider>
  {children}
</LayoutProvider>
```

#### Force Specific Layout
```tsx
// Force blank layout (e.g., for login page)
<LayoutProvider forceLayout="blank">
  {children}
</LayoutProvider>

// Force header layout (e.g., for authenticated pages)
<LayoutProvider forceLayout="header">
  {children}
</LayoutProvider>
```

## Implementation

### Page-Specific Layouts
Each page can have its own layout file:

- `src/app/login/layout.tsx` - Forces blank layout for login page
- `src/app/control/layout.tsx` - Forces header layout for control page

### Root Layout
The root layout (`src/app/layout.tsx`) wraps all pages with the `LayoutProvider`, which automatically selects the appropriate layout based on authentication status.

## Benefits

1. **Reusable**: Layouts can be easily reused across different pages
2. **Maintainable**: Clear separation of concerns between layouts
3. **Scalable**: Easy to add new layouts or modify existing ones
4. **Type Safe**: Full TypeScript support with proper interfaces
5. **Flexible**: Can force specific layouts when needed

## File Structure

```
src/
├── components/
│   └── layouts/
│       ├── BlankLayout.tsx
│       ├── HeaderLayout.tsx
│       ├── LayoutProvider.tsx
│       └── index.ts
└── app/
    ├── layout.tsx (root layout)
    ├── login/
    │   ├── layout.tsx (forces blank layout)
    │   └── page.tsx
    └── control/
        ├── layout.tsx (forces header layout)
        └── page.tsx
``` 