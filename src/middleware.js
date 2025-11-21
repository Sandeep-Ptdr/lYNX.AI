import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
 

  // Public pages
  const isPublic =
    path === "/login" || path === "/register";

  // Detect NextAuth JWT cookie
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
    console.log('token',token)

  // If user is logged in and tries to access login/register → redirect to home
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user NOT logged in and tries to access protected route → redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/xyz",
    "/xyz/:path*",   
    '/login',
    '/register',
  ],
};
