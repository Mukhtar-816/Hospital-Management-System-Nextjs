import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // Redirect logged-in users away from auth pages
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/", request.url));
      } catch {
        // Invalid token — let them through to login/register
      }
    }
    return NextResponse.next();
  }

  // Public routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
    // pathname.includes(".") ||
  ) {
    return NextResponse.next();
  }

  // Protected routes — require valid token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth_token");
    return res;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
