import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "@/lib/auth/permission";
import { pool } from "@/lib/db";
import * as userService from "@/lib/services/user/user.service";
import * as patientService from "@/lib/services/patient/patient.service";
import { hashPassword } from "@/lib/auth/hash";

export async function GET(req: Request) {
  try {
    const decoded = await getUser(req) as { userid: string } | null;
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserRoleAndPermissions(decoded.userid);
    requirePermission("patient.read", access)

    const result = await pool.query("SELECT * FROM patient");
    return NextResponse.json({ patients: result.rows });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = await getUser(req) as { userid: string } | null;
    const access = await getUserRoleAndPermissions(decoded?.userid!);
    requirePermission("patient.create", access);

    const { email, useremail, password, fullname } = await req.json();
    const targetEmail = useremail ?? email;

    const hashed = await hashPassword(password);
    const user = await userService.createUser(targetEmail, hashed);

    await patientService.createPatient(user.userid, fullname);
    await userService.assignRole(user.userid, "patient");

    return NextResponse.json({ success: true, userid: user.userid });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = await getUser(req) as { userid: string } | null;
    const body = await req.json();
    const { userid: targetUserId } = body;

    const access = await getUserRoleAndPermissions(decoded?.userid!);
    requirePermission("patient.update", access);

    await patientService.updatePatient(targetUserId, body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed" }, { status: 400 });
  }
}