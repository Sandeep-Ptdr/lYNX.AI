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
    // console.log('token---',token)
  
  // If user is logged in and tries to access login/register → redirect to home
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/chat/new", request.url));
  }

  // If user NOT logged in and tries to access protected route → redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat/new",
    "/chat/:path*",   
    '/login',
    '/register',
  ],
};



// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// // Public Authentication Routes
// const authRoutes = ['/login', '/register'];

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 
//   const { pathname } = req.nextUrl;

//   const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  

//   // If user is logged in and trying to access login/signup → redirect to home
//   if (token && isAuthRoute) {
//     console.log('token',token,'Auth route',isAuthRoute)
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   // If user not logged in and trying to access protected routes → redirect to login
//   if (!token && !isAuthRoute) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   return NextResponse.next();
// }

// // Apply middleware to all frontend routes except static and API assets
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

