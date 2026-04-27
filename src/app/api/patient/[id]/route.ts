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

        const { name, address, gender, patientnumber } = await request.json();

        await client.query("BEGIN");

        const check = await client.query(
            `SELECT userid FROM patient WHERE patientid = $1`,
            [id]
        );

        if (check.rows.length === 0) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        const ownerUserId = check.rows[0].userid;

        if (
            !user.permissions?.includes("update_patient") &&
            ownerUserId !== user.userId
        ) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const userFields: string[] = [];
        const userValues: any[] = [];
        let index = 1;

        if (name !== undefined) {
            userFields.push(`username = $${index++}`);
            userValues.push(name);
        }

        if (userFields.length > 0) {
            userValues.push(ownerUserId);

            await client.query(
                `UPDATE users SET ${userFields.join(", ")} WHERE userid = $${index}`,
                userValues
            );
        }

        const patientFields: string[] = [];
        const patientValues: any[] = [];
        index = 1;

        if (address !== undefined) {
            patientFields.push(`address = $${index++}`);
            patientValues.push(address);
        }

        if (gender !== undefined) {
            patientFields.push(`gender = $${index++}`);
            patientValues.push(gender);
        }

        if (patientnumber !== undefined) {
            patientFields.push(`patientnumber = $${index++}`);
            patientValues.push(patientnumber);
        }

        let result;

        if (patientFields.length > 0) {
            patientValues.push(id);

            result = await client.query(
                `UPDATE patient 
         SET ${patientFields.join(", ")} 
         WHERE patientid = $${index} 
         RETURNING *`,
                patientValues
            );
        } else {
            result = await client.query(
                `SELECT * FROM patient WHERE patientid = $1`,
                [id]
            );
        }

        await client.query("COMMIT");

        return NextResponse.json(result.rows[0], { status: 200 });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);

        return NextResponse.json(
            { error: "Error updating patient" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}