import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import {
  getPatientByUserId,
  updatePatient,
} from "@/lib/services/patient/patient.service";
import {
  getReceptionistByUserId,
  updateReceptionist,
} from "@/lib/services/receptionist/receptionist.service";
import { findById } from "@/lib/services/user/user.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = (await getUser(req)) as { userid: string } | null;
    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserRoleAndPermissions(decoded.userid);
    requirePermission("receptionist.read", access);

    const user = await findById(decoded.userid);
    const receptionist = await getReceptionistByUserId(decoded.userid);
    if (!receptionist || !user)
      return NextResponse.json(
        { error: "Receptionist not found" },
        { status: 404 },
      );
    return NextResponse.json({
      ...receptionist,
      ...user,
      role: "receptionist",
    });
  } catch (error: any) {
    devLog(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = (await getUser(req)) as { userid: string } | null;
    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getUserRoleAndPermissions(decoded.userid);
    requirePermission("profile.update", access);

    const user = await findById(decoded.userid);
    const receptionist = await getReceptionistByUserId(decoded.userid);
    if (!receptionist || !user)
      return NextResponse.json(
        { error: "Receptionist not found" },
        { status: 404 },
      );

    const data = await req.json();
    const updatedReceptionist = await updateReceptionist(decoded.userid, data);
    if (!updatedReceptionist)
      return NextResponse.json(
        { error: "Receptionist not updated" },
        { status: 500 },
      );

    return NextResponse.json({ ...updatedReceptionist, ...user });
  } catch (error: any) {
    devLog(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
