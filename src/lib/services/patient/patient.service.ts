import { pool } from "@/lib/db";

export async function createPatient(userId: string, fullname: string) {
  const result = await pool.query(
    `INSERT INTO patient (userid, name)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, fullname]
  );

  return result.rows[0];
}