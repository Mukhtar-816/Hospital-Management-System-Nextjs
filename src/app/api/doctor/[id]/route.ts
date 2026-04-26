import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "src/lib/auth";
import { pool } from "src/lib/db";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await context.params;
    const user: any = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { specialization, status } = await request.json();

    // allow admin OR own profile
    if (!user.permissions.includes("update_doctor")) {
      const check = await client.query(
        `SELECT userid FROM doctor WHERE doctorid = $1`,
        [id]
      );

      if (check.rows[0]?.userid !== user.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const result = await client.query(
      `UPDATE doctor
       SET specialization = $1, status = $2
       WHERE doctorid = $3
       RETURNING *`,
      [specialization, status, id]
    );

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  } finally {
    client.release();
  }
}