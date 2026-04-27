import { NextResponse } from "next/server";

import { pool } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const { name, email, password, username, address, gender } = await request.json();

        if (!name || !email || !password || !username) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        await client.query("BEGIN");

        const userRes = await client.query(
            `INSERT INTO Users (userName, userEmail, userPassword) 
       VALUES ($1, $2, $3) 
       RETURNING userId`,
            [username, email, hashedPassword]
        );
        const userId = userRes.rows[0].userid;

        await client.query(
            `INSERT INTO UserRole (userId, roleId)
       SELECT $1, roleId FROM Role WHERE name = 'patient'`,
            [userId]
        );


        await client.query(
            `INSERT INTO Patient (userId, address, gender, patientNumber)
       VALUES ($1, $2, $3, $4)`,
            [userId, address || null, gender || null, null]
        );

        await client.query("COMMIT");

        return NextResponse.json(
            { message: "Registration successful" },
            { status: 201 }
        );
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Registration error:", error);

        if (error.code === "23505") {
            return NextResponse.json(
                { error: "Username or email already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
