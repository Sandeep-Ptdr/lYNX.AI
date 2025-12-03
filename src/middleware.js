// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const path = request.nextUrl.pathname;

//   // Public pages
//   const isPublic =
//     path === "/login" || path === "/register";

//   // Detect NextAuth JWT cookie
//   const token =
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value;
//     // console.log('token---',token)

//   // If user is logged in and tries to access login/register → redirect to home
//   if (isPublic && token) {
//     return NextResponse.redirect(new URL("/chat/new", request.url));
//   }

//   // If user NOT logged in and tries to access protected route → redirect to login
//   if (!isPublic && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/chat/new",
//     "/chat/:path*",
//     '/login',
//     '/register',
//   ],
// };

// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   matcher: ["/chat/new", "/chat/:path*"],
// };








import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register"];
const authRoutes = ["/login", "/register"]; // No access if logged in

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // If logged in and user tries to visit login/register → redirect to chat
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/chat/new", req.url));
  }

  // If NOT logged in and tries to access protected routes → redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

