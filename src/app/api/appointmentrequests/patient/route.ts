import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import * as requestService from "@/lib/services/appointment/appointmentRequest.service";
import { getPatientByUserId } from "@/lib/services/patient/patient.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access || access.role !== "patient") {
      throw new Error("Unauthorized");
    }

    const patient = await getPatientByUserId(decoded.userid);
    if (!patient) throw new Error("Patient profile not found");

    const requests = await requestService.getAppointmentRequestsByPatientId(
      patient.patientid,
    );

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    devError("GET PATIENT REQUESTS ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch requests" },
      { status: err.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
