import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - cadastro (cadastro page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|cadastro).*)',
  ],
};
