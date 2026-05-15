import { devLog, devError } from "@/lib/logger";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { getInteractionsByPatientId } from "@/lib/services/interaction/interaction.service";
import { getPatientByUserId } from "@/lib/services/patient/patient.service";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    if (!access || access.role !== "patient") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patient = await getPatientByUserId(decoded.userid);
    if (!patient) throw new Error("Patient profile not found");

    const records = await getInteractionsByPatientId(patient.patientid);
    return NextResponse.json({ success: true, records });
  } catch (err: any) {
    devError("GET PATIENT RECORDS ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
