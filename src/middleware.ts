import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") || req.url.startsWith("/api");

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    if (token && token.tokenExpires && Date.now() >= token.tokenExpires) {
      const response = NextResponse.redirect(new URL("/auth/signin", req.url));
      response.cookies.set("next-auth.session-token", "", {maxAge: 0});
      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({token}) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
