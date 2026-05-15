import { devLog, devError } from "@/lib/logger";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "@/lib/auth/permission";
import * as appointmentService from "@/lib/services/appointment/appointment.service";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    requirePermission("appointment.update", access);

    const appointment = await appointmentService.checkinAppointment(id);

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    devError("CHECKIN APPOINTMENT ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to check-in appointment" },
      { status: err.message.includes("Invalid transition") ? 400 : 500 }
    );
  }
}
