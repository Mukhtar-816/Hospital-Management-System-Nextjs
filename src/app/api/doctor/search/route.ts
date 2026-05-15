import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import { searchDoctorsForAppointment } from "@/lib/services/doctor/doctor.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = (await getUser(req)) as { userid: string } | null;
    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserRoleAndPermissions(decoded.userid);
    requirePermission("appointment.create", access);

    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get("specialization") || undefined;
    const appointmentTime = searchParams.get("time") || undefined;

    if (!appointmentTime) {
      return NextResponse.json(
        { error: "Time is required for conflict check" },
        { status: 400 },
      );
    }

    const doctors = await searchDoctorsForAppointment({
      specialization,
      appointmentTime,
    });

    return NextResponse.json({ doctors });
  } catch (err: any) {
    devError("SEARCH_DOCTORS_ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
