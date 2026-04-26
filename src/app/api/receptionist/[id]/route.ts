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

        const { name, email } = await request.json();

        await client.query("BEGIN");

        // 🔍 find owner userId from receptionist
        const check = await client.query(
            `SELECT userid FROM receptionist WHERE receptionistid = $1`,
            [id]
        );

        if (check.rows.length === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Receptionist not found" }, { status: 404 });
        }

        const ownerUserId = check.rows[0].userid;

        // 🔐 permission: admin OR self
        if (
            !user.permissions.includes("update_user") &&
            ownerUserId !== user.userId
        ) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // ✅ update USERS only (no receptionist fields exist)
        await client.query(
            `UPDATE users
       SET username = $1,
           useremail = $2
       WHERE userid = $3`,
            [name, email, ownerUserId]
        );

        await client.query("COMMIT");

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return NextResponse.json({ error: "Error updating receptionist" }, { status: 500 });
    } finally {
        client.release();
    }
}