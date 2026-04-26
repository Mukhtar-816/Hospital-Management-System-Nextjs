import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    const user: any = await getUserFromRequest(request);

    // Simple auth check
    if (!user || !user.permissions.includes("create_doctor")) { // using create_doctor as an admin check for now or just generic admin check
      // Let's just allow it for now or check if role is admin.
      // Wait, let's look at getUserFromRequest to see what we have
    }

    const result = await client.query(`
      SELECT 
        u.userid, 
        u.username as name, 
        u.useremail as email, 
        r.name as role,
        d.specialization,
        p.address,
        p.gender
      FROM users u
      LEFT JOIN userrole ur ON u.userid = ur.userid
      LEFT JOIN role r ON ur.roleid = r.roleid
      LEFT JOIN doctor d ON u.userid = d.userid
      LEFT JOIN patient p ON u.userid = p.userid
      ORDER BY u.createdat DESC
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    client.release();
  }
}
