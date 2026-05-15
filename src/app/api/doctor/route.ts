import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { hashPassword } from "@/lib/auth/hash";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import * as doctorService from "@/lib/services/doctor/doctor.service";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) throw new Error("Forbidden");

    const doctors = await doctorService.getAllDoctors();

    return NextResponse.json({ success: true, doctors });
  } catch (err: any) {
    devError("GET DOCTORS ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch doctors" },
      { status: err.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string } | null;
    const access = await getUserRoleAndPermissions(decoded?.userid!);
    requirePermission("doctor.create", access);

    const { email, useremail, password, fullname, specialization } =
      await req.json();
    const targetEmail = useremail ?? email;
    const hashed = await hashPassword(password);

    const user = await userService.createFullUser({
      email: targetEmail,
      passwordHash: hashed,
      role: "doctor",
      profileData: { fullname, specialization },
      profileCreator: async (client, userid, data) => {
        return await doctorService.createDoctor(
          userid,
          data.fullname,
          data.specialization,
          client,
        );
      },
    });

    return NextResponse.json({ success: true, userid: user.userid });
  } catch (err: any) {
    devError("POST DOCTOR ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create doctor" },
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string } | null;
    const access = await getUserRoleAndPermissions(decoded?.userid!);
    requirePermission("doctor.read", access);

    const { userid, fullname, specialization } = await req.json();

    await doctorService.updateDoctor(userid, fullname, specialization);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    devError("PUT DOCTOR ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update doctor" },
      { status: 400 },
    );
  }
}
