import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { pool } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const body = await req.json();
    const patientid = body.patientid;
    const userid = body.userid;
    const useremail = body.useremail;

    const userResult = await pool.query(
      "UPDATE users SET useremail = $1 WHERE userid = $2 RETURNING userid",
      [useremail, userid],
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const result = patientid
      ? await pool.query(
          `UPDATE patient
       SET fullname = $1, address = $2, gender = $3, patientnumber = $4
       WHERE patientid = $5 RETURNING *`,
          [
            body.fullname,
            body.address,
            body.gender,
            body.patientnumber,
            patientid,
          ],
        )
      : await pool.query(
          `UPDATE patient
       SET fullname = $1, address = $2, gender = $3, patientnumber = $4
       WHERE userid = $5 RETURNING *`,
          [
            body.fullname,
            body.address,
            body.gender,
            body.patientnumber,
            userid,
          ],
        );

    const patient = result.rows[0];

    if (!patient) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
