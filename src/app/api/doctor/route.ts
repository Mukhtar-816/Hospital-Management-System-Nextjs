import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import * as userService from "@/lib/services/user/user.service";
import * as doctorService from "@/lib/services/doctor/doctor.service";
import { hashPassword } from "@/lib/auth/hash";

export async function POST(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const body = await req.json();
    const email = body.useremail ?? body.email;
    const { password, fullname, specialization } = body;

    const hashed = await hashPassword(password);
    const user = await userService.createUser(email, hashed);

    await doctorService.createDoctor(user.userid, fullname, specialization);
    await userService.assignRole(user.userid, "doctor");

    return Response.json({ success: true, userid: user.userid });
  } catch (err: any) {
    console.error("CREATE DOCTOR ERROR:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const body = await req.json();
    const { userid, fullname, specialization } = body;

    const user = await userService.findById(userid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await doctorService.updateDoctor(userid, fullname, specialization);

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("UPDATE DOCTOR ERROR:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
