import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { login } from "../../../../lib/services/auth/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await login(body);
    const cookieStore = await cookies();

    cookieStore.set("token", result.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
