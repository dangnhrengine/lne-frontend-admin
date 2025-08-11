# LNE Frontend Admin Dashboard

A modern, responsive admin dashboard built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive admin interface for managing members, registrations, and purchase history with robust authentication and internationalization support.

## 🚀 Features

### Core Functionality
- **Authentication System**: JWT-based login with protected routes
- **Member Management**: View and manage member accounts
- **Member Registration**: Create new member accounts
- **Purchase History**: Track and manage purchase records
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Internationalization**: Full Japanese (ja) language support

### Technical Features
- **Modern React**: Built with React 19 and Next.js 15
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context with custom hooks
- **API Integration**: Axios-based HTTP client with centralized error handling
- **Performance**: React Query for data fetching and caching
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── login/            # Authentication page
│   ├── members/          # Member management pages
│   ├── purchase-history/ # Purchase history pages
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── common/           # Shared UI components
│   └── layouts/          # Layout components
├── api/                  # API layer and data fetching
│   ├── auth/             # Authentication API
│   ├── users/            # User management API
│   └── lib/              # API utilities
├── hooks/                 # Custom React hooks
├── providers/             # Context providers
├── utils/                 # Utility functions
├── constants/             # Application constants
├── types/                 # TypeScript type definitions
└── styles/                # Global styles and Tailwind config
```

### Key Components

#### Authentication System
- **ProtectedRoute**: Client-side route protection with automatic redirects
- **AuthProvider**: Global authentication state management
- **LoginForm**: User login interface with validation
- **useAuth**: Custom hook for authentication state

#### Layout System
- **SidebarLayout**: Main application layout with header and sidebar
- **Header**: Top navigation bar with logout functionality
- **Sidebar**: Left navigation with menu items and active states

#### API Layer
- **axiosClient**: Centralized HTTP client with interceptors
- **Error Handling**: Structured error handling with `withApiErrorHandling`
- **Type Safety**: Full TypeScript interfaces for API requests/responses

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Type-safe JavaScript

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Responsive Design**: Mobile-first approach

### State Management & Data
- **React Context**: Global state management
- **React Query**: Server state management and caching
- **Local Storage**: Client-side data persistence

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Yarn**: Package management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lne-frontend-admin
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:5001/api
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_APP_NAME=lne-frontend-admin
   NEXT_PUBLIC_APP_VERSION=0.1.0
   ```

4. **Run development server**
   ```bash
   yarn dev
   ```

5. **Build for production**
   ```bash
   yarn build
   yarn start
   ```

## 🔧 Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

## 🌐 Internationalization

The application supports Japanese (ja) localization with comprehensive translation coverage:

- **Navigation**: Menu items and breadcrumbs
- **Pages**: Content and descriptions
- **UI Elements**: Buttons, forms, and messages
- **Validation**: Error messages and form validation
- **Common**: Shared text and labels

Translation files are located in `messages/ja.json` and use the `next-intl` library for seamless language switching.

## 🔐 Authentication Flow

### Login Process
1. User enters login ID and password
2. Form validation ensures required fields
3. API call to backend authentication endpoint
4. JWT token and user data stored in localStorage
5. Automatic redirect to members page

### Route Protection
- **Protected Routes**: Require authentication (e.g., `/members`)
- **Public Routes**: No authentication required (e.g., `/login`)
- **Automatic Redirects**: Unauthenticated users → login, authenticated users → members

### Security Features
- JWT token validation
- Automatic token injection in API requests
- Secure logout with token removal
- Protected route components

## 📱 UI Components

### Reusable Components
- **Button**: Flexible button with appearance, tone, and size variants
- **ErrorMessage**: Consistent error display with layout preservation
- **Spinner**: Loading indicators for async operations
- **FormButton**: Specialized button for form submissions
- **InputValidator**: Form input with validation support

### Design System
- **Color Palette**: Black primary with gray accents
- **Typography**: Consistent font weights and sizes
- **Spacing**: Tailwind-based spacing system
- **Icons**: Lucide React icons with consistent styling

## 🚀 API Integration

### HTTP Client
- **Axios**: Centralized HTTP client with interceptors
- **Base URL**: Configurable from environment variables
- **Headers**: Automatic Content-Type and Authorization
- **Error Handling**: Structured error responses

### API Patterns
```typescript
// Using the centralized error handling
import { withApiErrorHandling } from '@/api/lib';

export const fetchData = async () => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.get('/endpoint');
    return data.data;
  });
};
```

### Error Handling
- **Structured Errors**: Consistent error format across API
- **User-Friendly Messages**: Localized error messages
- **Automatic Logging**: Request/response logging with environment awareness

## 📊 State Management

### Authentication State
```typescript
const { isAuthenticated, user, login, logout } = useAuth();
```

### Global State
- User authentication status
- Current user information
- Loading states
- Access token management

## 🎨 Styling & Design

### Tailwind CSS
- Utility-first approach
- Responsive design system
- Custom color palette
- Consistent spacing and typography

### Component Styling
- Modular CSS classes
- Responsive breakpoints
- Dark/light theme support
- Hover and focus states

## 🔍 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **Interface Naming**: Prefix with `I` (e.g., `IUser`)

### Best Practices
- **Component Reusability**: Design components for reuse
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error management
- **Performance**: React Query for data optimization
- **Accessibility**: Semantic HTML and ARIA support

### File Organization
- **Feature-based**: Group related functionality
- **Clear Imports**: Use alias imports (`@/components`)
- **Consistent Naming**: Follow established patterns
- **Documentation**: Inline comments for complex logic

## 🚀 Deployment

### Build Process
1. **Environment Setup**: Configure production environment variables
2. **Build**: `yarn build` creates optimized production build
3. **Static Generation**: Pages are pre-rendered for performance
4. **Server Start**: `yarn start` runs production server

### Environment Variables
- **Development**: `.env.local` for local development
- **Production**: Set environment variables in deployment platform
- **Security**: Never commit sensitive data to version control

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Run linting and formatting
4. Submit pull request with description
5. Code review and approval process

### Quality Standards
- **TypeScript**: No `any` types, proper interfaces
- **Testing**: Component and integration tests
- **Documentation**: Update README and inline docs
- **Performance**: Optimize bundle size and loading

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Check existing documentation
- Review code comments and types
- Consult development team
- Create issue in project repository

---

**Built with ❤️ using Next.js, React, and TypeScript**
