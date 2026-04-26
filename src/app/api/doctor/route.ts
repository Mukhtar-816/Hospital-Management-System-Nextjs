import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";
import { hashPassword } from "src/lib/hash";

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user || !user.permissions.includes("create_doctor")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password, specialization } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    await client.query("BEGIN");

    // 1. create user
    const userRes = await client.query(
      `INSERT INTO users (username, useremail, userpassword)
       VALUES ($1, $2, $3)
       RETURNING userid`,
      [name, email, hashed]
    );

    const userId = userRes.rows[0].userid;

    // 2. assign role
    const roleRes = await client.query(
      `SELECT roleid FROM role WHERE name = 'doctor'`
    );

    if (roleRes.rowCount === 0) {
      throw new Error("Doctor role not found");
    }

    const roleId = roleRes.rows[0].roleid;

    await client.query(
      `INSERT INTO userrole (userid, roleid)
       VALUES ($1, $2)`,
      [userId, roleId]
    );

    // 3. doctor profile
    const doctorRes = await client.query(
      `INSERT INTO doctor (userid, specialization)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, specialization]
    );

    await client.query("COMMIT");

    return NextResponse.json(doctorRes.rows[0], { status: 201 });

  } catch (e) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Error creating doctor" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user || !user.permissions.includes("read_doctor")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await client.query(`
      SELECT 
        d.doctorid,
        d.specialization,
        d.status,
        u.username,
        u.useremail
      FROM doctor d
      JOIN users u ON d.userid = u.userid
      ORDER BY u.username
    `);

    return NextResponse.json(result.rows, { status: 200 });

  } catch {
    return NextResponse.json({ error: "Error fetching doctors" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user || !user.permissions.includes("update_doctor")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, name, email, specialization } = await request.json();

    if (!id || !name || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await client.query("BEGIN");

    await client.query(
      `UPDATE users 
       SET username = $1, useremail = $2 
       WHERE userid = $3`,
      [name, email, id]
    );

    await client.query(
      `UPDATE doctor 
       SET specialization = $1 
       WHERE userid = $2`,
      [specialization, id]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });

  } catch (e) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Error updating doctor" }, { status: 500 });
  } finally {
    client.release();
  }
}