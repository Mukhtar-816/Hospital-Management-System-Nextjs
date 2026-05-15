import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { pool } from "@/lib/db";
import { devError, devLog } from "@/lib/logger";
import * as doctorService from "@/lib/services/doctor/doctor.service";
import * as patientService from "@/lib/services/patient/patient.service";
import * as receptionistService from "@/lib/services/receptionist/receptionist.service";
import * as userService from "@/lib/services/user/user.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const { id } = await params;
    const result = await pool.query("DELETE FROM users WHERE userid = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const { id: userid } = await params;
    const body = await req.json();
    const { role, fullname, specialization } = body;

    await userService.assignRole(userid, role);

    if (role === "doctor") {
      await doctorService.createDoctor(userid, fullname, specialization);
    } else if (role === "receptionist") {
      await receptionistService.createReceptionist(userid, fullname);
    } else if (role === "patient") {
      await patientService.createPatient(userid, fullname);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    devError("ADMIN ASSIGN ROLE ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
