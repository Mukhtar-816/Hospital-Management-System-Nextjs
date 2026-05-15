import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { hashPassword } from "@/lib/auth/hash";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { pool } from "@/lib/db";
import { devError, devLog } from "@/lib/logger";
import * as patientService from "@/lib/services/patient/patient.service";
import * as userService from "@/lib/services/user/user.service";
import { validateEmail, validateRequired } from "@/lib/validation-helper";

export async function GET(req: NextRequest) {
  try {
    const decoded = (await getUser(req)) as { userid: string } | null;
    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserRoleAndPermissions(decoded.userid);
    requirePermission("patient.read", access);

    const result = await pool.query("SELECT * FROM patient");
    return NextResponse.json({ patients: result.rows });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = (await getUser(req)) as { userid: string } | null;
    const access = await getUserRoleAndPermissions(decoded?.userid!);
    requirePermission("patient.create", access);

    const body = await req.json();
    const { useremail, email, password, fullname, patientnumber } = body;
    const targetEmail = useremail ?? email;

    // Backend Validation
    const required = validateRequired({
      fullname,
      email: targetEmail,
      password,
    });
    if (!required.isValid) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${required.missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (!validateEmail(targetEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(password);

    const user = await userService.createFullUser({
      email: targetEmail,
      passwordHash: hashed,
      role: "patient",
      profileData: { ...body, fullname },
      profileCreator: async (client, userid, data) => {
        return await patientService.createPatient(userid, data, client);
      },
    });

    devLog("Patient created successfully:", user.userid);
    return NextResponse.json({ success: true, userid: user.userid });
  } catch (err: any) {
    devError("Patient registration error:", err);
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = (await getUser(req)) as { userid: string } | null;
    const body = await req.json();
    const { userid: targetUserId } = body;

    const access = await getUserRoleAndPermissions(decoded?.userid!);
    requirePermission("patient.update", access);

    await patientService.updatePatient(targetUserId, body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 400 },
    );
  }
}
