import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getNotificationsByUserId } from "@/lib/services/notification/notification.service";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const notifications = await getNotificationsByUserId(decoded.userid);
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
