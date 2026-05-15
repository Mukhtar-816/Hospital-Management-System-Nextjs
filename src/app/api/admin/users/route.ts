import { devLog, devError } from "@/lib/logger";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import * as userService from "@/lib/services/user/user.service";
import { hashPassword } from "@/lib/auth/hash";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const users = await userService.getUsersForAdminDashboard();

    return Response.json(users);
  } catch (err: any) {
    devLog(err)
    if (err?.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return Response.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const body = await req.json();
    const { email, password } = body;

    const hashed = await hashPassword(password);
    const user = await userService.createUser(email, hashed);

    return Response.json({ success: true, user });
  } catch (err: any) {
    devError("ADMIN CREATE USER ERROR:", err);
    return Response.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
