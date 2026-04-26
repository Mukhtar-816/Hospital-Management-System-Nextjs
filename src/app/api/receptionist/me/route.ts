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
        r.receptionistid,
        r.createdat,
        u.userid,
        u.username,
        u.useremail
      FROM receptionist r
      JOIN users u ON r.userid = u.userid
      WHERE r.userid = $1
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