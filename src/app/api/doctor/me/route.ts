import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { getDoctorByUserId } from "@/lib/services/doctor/doctor.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    if (!access) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    requirePermission("doctor.read", access);

    const doctor = await getDoctorByUserId(decoded.userid);

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, doctor });
  } catch (err: any) {
    if (err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
