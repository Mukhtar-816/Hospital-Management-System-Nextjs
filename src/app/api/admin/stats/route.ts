import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "@/lib/auth/permission";
import { getAdminStats } from "@/lib/services/admin/admin.service";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    
    requirePermission("admin.read", access);

    const stats = await getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error("ADMIN STATS ERROR:", err);
    const isForbidden = err.message === "Forbidden" || err.message?.includes("denied");
    return NextResponse.json(
      { error: err.message || "Failed to fetch stats" }, 
      { status: isForbidden ? 403 : 500 }
    );
  }
}
