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

        if (!user.permissions.includes("read_own_data")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const result = await client.query(
            `
  SELECT 
    re.receptionistid,
    re.createdat,
    u.userid,
    u.username,
    u.useremail,
    r.name as role
  FROM receptionist re
  JOIN users u ON re.userid = u.userid
  JOIN userrole ur ON ur.userid = u.userid
  JOIN role r ON r.roleid = ur.roleid
  WHERE u.userid = $1
  `,
            [user.userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Receptionist not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        client.release();
    }
}