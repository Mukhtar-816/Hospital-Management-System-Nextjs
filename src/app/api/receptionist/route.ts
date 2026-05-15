import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { hashPassword } from "@/lib/auth/hash";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import * as receptionistService from "@/lib/services/receptionist/receptionist.service";
import * as userService from "@/lib/services/user/user.service";

export async function POST(req: NextRequest) {
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

    const user = await userService.createFullUser({
      email,
      passwordHash: hashed,
      role: "receptionist",
      profileData: { fullname },
      profileCreator: async (client, userid, data) => {
        return await receptionistService.createReceptionist(
          userid,
          data.fullname,
          client,
        );
      },
    });

    return NextResponse.json({ success: true, userid: user.userid });
  } catch (err: any) {
    devError("CREATE RECEPTIONIST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    devError("UPDATE RECEPTIONIST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 500 },
    );
  }
}
