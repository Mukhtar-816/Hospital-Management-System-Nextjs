import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";
import { hashPassword } from "src/lib/hash";

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user || !user.permissions.includes("create_receptionist")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await client.query("BEGIN");

    const hashed = await hashPassword(password);

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
      `SELECT roleid FROM role WHERE name = 'receptionist'`
    );

    await client.query(
      `INSERT INTO userrole (userid, roleid)
       VALUES ($1, $2)`,
      [userId, roleRes.rows[0].roleid]
    );

    // 3. create receptionist profile
    const receptionistRes = await client.query(
      `INSERT INTO receptionist (userid)
       VALUES ($1)
       RETURNING *`,
      [userId]
    );

    await client.query("COMMIT");

    return NextResponse.json(receptionistRes.rows[0], { status: 201 });

  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return NextResponse.json({ error: "Error creating receptionist" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user: any = await getUserFromRequest(request);

    if (!user || !user.permissions.includes("update_user")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, name, email } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await client.query("BEGIN");

    // check existence
    const check = await client.query(
      `SELECT userid FROM users WHERE userid = $1`,
      [id]
    );

    if (check.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await client.query(
      `UPDATE users
       SET username = $1,
           useremail = $2
       WHERE userid = $3`,
      [name, email, id]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true });

  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return NextResponse.json({ error: "Error updating receptionist" }, { status: 500 });
  } finally {
    client.release();
  }
}

