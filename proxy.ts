import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
const publicRoutes = ['/', '/auth/signin', '/auth/signup', "/auth/error"]
const protectedRoutes = ['/dashboard', '/profile']
const DEFAULT_REDIRECT = '/dashboard'
export default auth(async function proxy(req) {
  const {nextUrl} = req
  const {pathname} = req.nextUrl
  const isLoggedIn = !!req.auth
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // If user is logged in and trying to access public route, redirect to dashboard
  if (isLoggedIn && isPublicRoute) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }
  // If user is not logged in and trying to access protected route, redirect to signin
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(new URL('/auth/signin', nextUrl));
  }
  return NextResponse.next();

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};