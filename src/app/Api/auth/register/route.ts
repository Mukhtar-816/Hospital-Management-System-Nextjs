import { register } from "../../../../lib/services/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await register(body);

    return Response.json(result);
  } catch (err : unknown) {
    console.log(err)
    return Response.json({ error: err }, { status: 400 });
  }
}