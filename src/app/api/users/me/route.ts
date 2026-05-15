import { getUser } from "@/lib/auth/getUser";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };

    const me = await userService.getMe(decoded.userid);

    if (!me) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      userid: me.userid,
      useremail: me.useremail,
      fullname: me.fullname,
      role: me.role,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
