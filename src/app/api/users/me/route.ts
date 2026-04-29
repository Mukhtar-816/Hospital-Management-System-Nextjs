import { getUser } from "@/lib/auth/getUser";
import * as userService from "@/lib/services/user/user.service";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };

    const user = await userService.getMe(decoded.userid);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (err: any) {
    return Response.json({ error: err.message || "Something went wrong" }, { status: 400 });
  }
}