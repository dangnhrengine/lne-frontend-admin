import { NextResponse } from 'next/server';

/**
 * Authentication middleware
 * - For now, we'll let all requests pass through
 * - Client-side authentication will handle redirects
 * - This prevents server-side redirects that could cause issues
 */
export function middleware() {
  // Allow all requests to proceed
  // Authentication will be handled client-side by AuthProvider
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};