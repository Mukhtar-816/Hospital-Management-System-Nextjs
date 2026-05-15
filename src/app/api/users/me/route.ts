import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUser(req) as { userid: string };

    const me = await userService.getMe(decoded.userid);

    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userid: me.userid,
      useremail: me.useremail,
      fullname: me.fullname,
      role: me.role,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
