import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key");

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let user = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload as { role: string; userid: string };
    } catch (err) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (user && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${user.role}/dashboard`, req.url));
  }

  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user) {
    const roles = ["admin", "doctor", "patient", "receptionist"];
    for (const role of roles) {
      if (pathname.startsWith(`/${role}`) && user.role !== role) {
        return NextResponse.redirect(new URL(`/${user.role}/dashboard`, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};