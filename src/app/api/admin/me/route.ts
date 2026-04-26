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
            `SELECT 
        u.username,
        u.useremail,
        r.name as role
       FROM users u
       LEFT JOIN userrole ur ON u.userid = ur.userid
       LEFT JOIN role r ON ur.roleid = r.roleid
       WHERE u.userid = $1`,
            [user.userId]
        );

        return NextResponse.json(result.rows[0], { status: 200 });

    } catch {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    } finally {
        client.release();
    }
}