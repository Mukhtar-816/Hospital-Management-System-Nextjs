import { NextRequest } from "next/server";
import { pool } from "src/lib/db";

export async function GET(request: NextRequest) {
    const client = await pool.connect();

    try {
        const user = await client.query(`
            SELECT roleid, name FROM role
        `);
        return new Response(JSON.stringify({
            message: "success",
            data: user.rows
        }))
    } catch (error) {
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            data: error
        }))
    }
};