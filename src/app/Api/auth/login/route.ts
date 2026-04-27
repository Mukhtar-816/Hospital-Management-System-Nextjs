import { login } from "../../../../lib/services/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await login(body);

    return Response.json(result);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}