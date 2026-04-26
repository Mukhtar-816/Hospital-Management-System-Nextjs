import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await client.query(
      `SELECT 
       p.patientid,
       p.patientnumber,
       p.name,
       p.address,
       p.gender,
       p.createdat,

       u.username,
       u.useremail

       FROM patient p
       LEFT JOIN users u ON p.userid = u.userid
       WHERE p.userid = $1;`,
      [user.userId]
    );

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  } finally {
    client.release();
  }
}