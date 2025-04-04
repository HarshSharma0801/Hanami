import { NextResponse } from 'next/server';
import { auth } from './app/api/auth/[...nextauth]/route'; // Import auth from route.ts
import { apiAuthPrefix, publicRoutes, authRoutes } from './routes';

const defaultRedirect = '/campaign';
const uploadRoute = '/upload';

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  console.log('Is Logged In:', isLoggedIn);
  console.log('User Role:', userRole);

  const isUploadRoute = nextUrl.pathname.startsWith(uploadRoute);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isUploadRoute) return NextResponse.next();
  if (isApiAuthRoute) return NextResponse.next();
  if (isAuthRoute) {
    if (isLoggedIn) return NextResponse.redirect(new URL(defaultRedirect, nextUrl));
    return NextResponse.next();
  }
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};