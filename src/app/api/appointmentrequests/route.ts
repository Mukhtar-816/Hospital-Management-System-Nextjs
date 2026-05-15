import { devLog, devError } from "@/lib/logger";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "@/lib/auth/permission";
import * as requestService from "@/lib/services/appointment/appointmentRequest.service";
import { getPatientByUserId } from "@/lib/services/patient/patient.service";

export async function POST(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) throw new Error("Forbidden");
    
    if (access.role !== 'patient') {
        throw new Error("Only patients can create appointment requests");
    }

    const patient = await getPatientByUserId(decoded.userid);
    if (!patient) throw new Error("Patient profile not found");

    const body = await req.json();
    const { preferredtime, symptoms, priority } = body;

    const request = await requestService.createAppointmentRequest({
      patientid: patient.patientid,
      preferredtime,
      symptoms,
      priority: priority || 'low'
    });

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    devError("CREATE REQUEST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create request" },
      { status: err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) throw new Error("Forbidden");
    
    if (access.role !== 'receptionist' && access.role !== 'admin') {
        throw new Error("Unauthorized access to requests");
    }

    const requests = await requestService.getAppointmentRequests();

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    devError("GET REQUESTS ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
