import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: Request) {
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
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      userid: me.userid,
      useremail: me.useremail,
      role: me.role,
    });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
