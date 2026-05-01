import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import * as userService from "@/lib/services/user/user.service";
import * as receptionistService from "@/lib/services/receptionist/receptionist.service";
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
    const { password, fullname } = body;

    const hashed = await hashPassword(password);
    const user = await userService.createUser(email, hashed);
    
    await receptionistService.createReceptionist(user.userid, fullname);
    await userService.assignRole(user.userid, "receptionist");

    return Response.json({ success: true, userid: user.userid });
  } catch (err: any) {
    console.error("CREATE RECEPTIONIST ERROR:", err);
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
    const { userid, useremail, fullname } = body;

    const user = await userService.findById(userid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await receptionistService.updateReceptionist(userid, fullname);

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("UPDATE RECEPTIONIST ERROR:", err);
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
