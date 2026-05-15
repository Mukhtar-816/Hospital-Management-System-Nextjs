import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { hashPassword } from "@/lib/auth/hash";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const users = await userService.getUsersForAdminDashboard();

    return NextResponse.json(users);
  } catch (err: any) {
    devLog(err);
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
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

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    devError("ADMIN CREATE USER ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
