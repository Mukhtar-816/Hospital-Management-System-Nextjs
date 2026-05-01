import { authorize } from "@/lib/auth/authorize";
import { getUser } from "@/lib/auth/getUser";
import { pool } from "@/lib/db";
import * as userService from "@/lib/services/user/user.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decoded = getUser(req) as { userid: string };
    await authorize(decoded.userid, "READ_PATIENT");

    const me = await userService.getMe(decoded.userid);
    const role = me?.role ?? "";

    const { id } = await params;

    const result = await pool.query(
      "SELECT * FROM patient WHERE patientid = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const patient = result.rows[0];

    if (role === "doctor") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (role === "patient" && patient.userid !== decoded.userid) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ patient });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return Response.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
