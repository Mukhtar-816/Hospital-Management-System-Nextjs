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
      `SELECT d.doctorid,d.specialization,d.status,u.username,u.useremail FROM doctor d JOIN users u ON d.userid = u.userid WHERE d.userid = $1`,
      [user.userId]
    );

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  } finally {
    client.release();
  }
}