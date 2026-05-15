import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import { getAdminAppointmentAnalytics } from "@/lib/services/admin/admin.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    requirePermission("admin.read", access);

    const analytics = await getAdminAppointmentAnalytics();
    return NextResponse.json({ success: true, ...analytics });
  } catch (err: any) {
    devError("ADMIN APPOINTMENT STATS ERROR:", err);
    const isForbidden =
      err.message === "Forbidden" || err.message?.includes("denied");
    return NextResponse.json(
      { error: err.message || "Failed to fetch analytics" },
      { status: isForbidden ? 403 : 500 },
    );
  }
}
