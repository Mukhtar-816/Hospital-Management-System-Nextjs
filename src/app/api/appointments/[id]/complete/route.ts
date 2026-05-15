import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import * as appointmentService from "@/lib/services/appointment/appointment.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    requirePermission("appointment.update", access);

    const appointment = await appointmentService.completeAppointment(id);

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    devError("COMPLETE APPOINTMENT ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to complete appointment" },
      { status: err.message.includes("Invalid transition") ? 400 : 500 },
    );
  }
}
