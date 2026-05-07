import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { getReceptionistDashboardData } from "@/lib/services/dashboard/dashboard.service";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    if (!access || access.role !== "receptionist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await getReceptionistDashboardData();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error("GET RECEPTIONIST DASHBOARD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
