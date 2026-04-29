import { cookies } from "next/headers";
import { login } from "../../../../lib/services/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await login(body);
    const cookieStore = await cookies();

    cookieStore.set("auth_token", result.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return Response.json(result);
  } catch (err: any) {
    return Response.json({ error: err.message || "Something went wrong" }, { status: 400 });
  }
}   