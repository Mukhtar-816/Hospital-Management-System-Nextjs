import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import * as requestService from "@/lib/services/appointment/appointmentRequest.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (
      !access ||
      (access.role !== "receptionist" && access.role !== "admin")
    ) {
      throw new Error("Unauthorized");
    }

    const request = await requestService.updateAppointmentRequestStatus(
      id,
      "rejected",
    );

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    devError("REJECT REQUEST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to reject request" },
      { status: err.message === "Unauthorized" ? 401 : 500 },
    );
  }
}
