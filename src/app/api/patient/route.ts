import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";
import bcrypt from "bcryptjs";


export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user || !user.permissions.includes("read_patient")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await client.query(`
      SELECT 
        p.patientid,
        p.userid,
        u.username,
        u.useremail,
        p.address,
        p.gender,
        p.createdat
      FROM patient p
      JOIN users u ON p.userid = u.userid
      ORDER BY p.createdat DESC
    `);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    client.release();
  }
}



export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const currentUser: any = await getUserFromRequest(request);

    if (!currentUser || !currentUser.permissions.includes("create_patient")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password, address, gender } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.query("BEGIN");

    // 1. create user
    const hashed = await bcrypt.hash(password, 10);

    const userRes = await client.query(
      `INSERT INTO users (username, useremail, userpassword)
       VALUES ($1, $2, $3)
       RETURNING userid`,
      [name, email, hashed]
    );

    const userId = userRes.rows[0].userid;

    // 2. assign role
    const roleRes = await client.query(
      `SELECT roleid FROM role WHERE name = 'patient'`
    );

    await client.query(
      `INSERT INTO userrole (userid, roleid)
       VALUES ($1, $2)`,
      [userId, roleRes.rows[0].roleid]
    );

    // 3. create patient profile (NO name duplication)
    const patientRes = await client.query(
      `INSERT INTO patient (userid, address, gender)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, address, gender]
    );

    await client.query("COMMIT");

    return NextResponse.json(patientRes.rows[0], { status: 201 });

  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return NextResponse.json({ error: "Error creating patient" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: NextRequest) {
  const client = await pool.connect();

  try {
    const currentUser: any = await getUserFromRequest(request);

    if (!currentUser || !currentUser.permissions.includes("update_patient")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, name, email, address, gender } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await client.query("BEGIN");

    await client.query(
      `UPDATE users 
       SET username = $1, useremail = $2 
       WHERE userid = $3`,
      [name, email, id]
    );

    await client.query(
      `UPDATE patient 
       SET address = $1, gender = $2 
       WHERE userid = $3`,
      [address, gender, id]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });

  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return NextResponse.json({ error: "Error updating patient" }, { status: 500 });
  } finally {
    client.release();
  }
}

