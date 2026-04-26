import { NextResponse, type NextRequest } from "next/server";

import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_change_me"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    if (pathname === "/") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (pathname === "/") {
      switch (role) {
        case "patient":
          return NextResponse.redirect(new URL("/patient/dashboard", request.url));
        case "receptionist":
          return NextResponse.redirect(new URL("/receptionist/dashboard", request.url));
        case "doctor":
          return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
        case "admin":
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        default:
          return NextResponse.next();
      }
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/doctor") && role !== "doctor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/receptionist") && role !== "receptionist") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/patient") && role !== "patient") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
