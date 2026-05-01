import { pool } from "@/lib/db";

export async function createPatient(userid: string, fullname: string) {
  const result = await pool.query(
    `INSERT INTO patient (userid, fullname)
     VALUES ($1, $2)
     RETURNING *`,
    [userid, fullname],
  );

  return result.rows[0];
}
