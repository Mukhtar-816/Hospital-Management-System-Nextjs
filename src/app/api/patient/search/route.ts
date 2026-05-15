import { type NextRequest, NextResponse } from "next/server";
import { searchPatients } from "@/lib/services/patient/patient.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ patients: [] });
  }

  const patients = await searchPatients(q);
  return NextResponse.json({ patients });
}
