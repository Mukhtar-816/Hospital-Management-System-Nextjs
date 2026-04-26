import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";
import { hashPassword } from "src/lib/hash";

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const currentUser: any = await getUserFromRequest(request);

    // ✅ MUST protect this
    if (!currentUser || !currentUser.permissions.includes("create_user")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    await client.query("BEGIN");

    // ✅ Let DB handle defaults (cleaner)
    const userRes = await client.query(
      `INSERT INTO users (username, useremail, userpassword)
       VALUES ($1, $2, $3)
       RETURNING userid`,
      [name, email, hashed]
    );

    const userId = userRes.rows[0].userid;

    const roleRes = await client.query(
      `SELECT roleid FROM role WHERE name = 'admin'`
    );

    if (roleRes.rowCount === 0) {
      throw new Error("Admin role not found");
    }

    const roleId = roleRes.rows[0].roleid;

    await client.query(
      `INSERT INTO userrole (userid, roleid)
       VALUES ($1, $2)`,
      [userId, roleId]
    );

    await client.query("COMMIT");

    return NextResponse.json({ success: true, userId }, { status: 201 });

  } catch (e) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Error creating admin" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request: NextRequest) {
  const client = await pool.connect();

  try {
    const currentUser: any = await getUserFromRequest(request);

    // ✅ permission check
    if (!currentUser || !currentUser.permissions.includes("update_user")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, name, email } = await request.json();

    if (!id || !name || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await client.query(
      `UPDATE users
       SET username = $1, useremail = $2
       WHERE userid = $3`,
      [name, email, id]
    );

    return NextResponse.json({ success: true });

  } catch (e) {
    return NextResponse.json({ error: "Error updating admin" }, { status: 500 });
  } finally {
    client.release();
  }
}