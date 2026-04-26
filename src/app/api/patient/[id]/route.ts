import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";

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

    const { name, email, address, gender } = await request.json();

    await client.query("BEGIN");

    // 🔍 Get patient owner
    const check = await client.query(
      `SELECT userid FROM patient WHERE patientid = $1`,
      [id]
    );

    if (check.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const ownerUserId = check.rows[0].userid;

    // 🔐 Permission: admin OR own profile
    if (
      !user.permissions.includes("update_patient") &&
      ownerUserId !== user.userId
    ) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ update USERS (name/email)
    await client.query(
      `UPDATE users
       SET username = $1,
           useremail = $2
       WHERE userid = $3`,
      [name, email, ownerUserId]
    );

    // ✅ update PATIENT (domain data only)
    const result = await client.query(
      `UPDATE patient
       SET address = $1,
           gender = $2
       WHERE patientid = $3
       RETURNING *`,
      [address, gender, id]
    );

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ error: "Error updating patient" }, { status: 500 });
  } finally {
    client.release();
  }
}