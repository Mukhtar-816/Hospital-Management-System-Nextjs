import { register } from "../../../../lib/services/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await register(body);

    return Response.json(result);
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
