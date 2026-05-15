import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { getDoctorDashboardData } from "@/lib/services/dashboard/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access: any = await getUserRoleAndPermissions(decoded.userid);

    if (!access || access.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await getDoctorDashboardData(access.id);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
