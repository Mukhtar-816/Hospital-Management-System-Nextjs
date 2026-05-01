import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const body = await req.json();
    console.log("BODY:", body);
    const useremail = body.useremail ?? body.email;
    const { password, fullname } = body;

    const userResult = await pool.query(
      "INSERT INTO users (useremail, userpassword) VALUES ($1, $2) RETURNING userid",
      [useremail, password],
    );
    const userid = userResult.rows[0].userid;
    console.log("USERID:", userid);

    await pool.query(
      "INSERT INTO receptionist (userid, fullname) VALUES ($1, $2)",
      [userid, fullname],
    );

    const roleRes = await pool.query(
      "SELECT roleid FROM role WHERE name = 'receptionist'",
    );
    if (roleRes.rows.length === 0) {
      throw new Error("Role not found");
    }

    await pool.query("INSERT INTO userrole (userid, roleid) VALUES ($1, $2)", [
      userid,
      roleRes.rows[0].roleid,
    ]);
    console.log("ROLE ASSIGNED");

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("CREATE ROLE ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) {
      throw new Error("Forbidden");
    }
    requirePermission("admin.read", access);

    const body = await req.json();
    const { userid, useremail, fullname } = body;

    const userResult = await pool.query(
      "UPDATE users SET useremail = $1 WHERE userid = $2 RETURNING userid",
      [useremail, userid],
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await pool.query(
      "UPDATE receptionist SET fullname = $1 WHERE userid = $2",
      [fullname, userid],
    );

    return Response.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("CREATE ROLE ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
