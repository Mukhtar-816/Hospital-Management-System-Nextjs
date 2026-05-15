import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import {
  createAppointment,
  getAllAppointments,
} from "@/lib/services/appointment/appointment.service";
import { handleApiError } from "@/lib/utils/errorHandler";

export async function POST(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("appointment.create", access);

    const body = await req.json();
    const { patientid, doctorid, starttime, type, requestid } = body;

    const appointment = await createAppointment({
      patientid,
      doctorid,
      receptionistid: decoded.userid,
      starttime,
      type: type || "walk-in",
      requestid: requestid || null,
    });

    return NextResponse.json({
      success: true,
      appointmentid: appointment.appointmentid,
    });
  } catch (err: any) {
    const message = handleApiError(err);
    return NextResponse.json(
      { error: message },
      { status: message.includes("denied") ? 403 : 400 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("appointment.read", access);

    const appointments = await getAllAppointments();

    return NextResponse.json({ success: true, appointments });
  } catch (err: any) {
    const message = handleApiError(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
