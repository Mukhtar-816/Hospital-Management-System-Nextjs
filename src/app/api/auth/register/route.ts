import { type NextRequest, NextResponse } from "next/server";
import { register } from "../../../../lib/services/auth/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await register(body);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
