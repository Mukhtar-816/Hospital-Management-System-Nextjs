import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const userid = decoded.userid;

    const access = await getUserRoleAndPermissions(userid);
    if (!access) {
      throw new Error("Forbidden");
    }

    requirePermission("admin.read", access);

    const me = await userService.getMe(userid);
    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userid: me.userid,
      useremail: me.useremail,
      role: me.role,
    });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
