import { pool } from "@/lib/db";

export async function createDoctor(userid: string, fullname: string, specialization: string) {
  const result = await pool.query(
    `INSERT INTO doctor (userid, fullname, specialization)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userid, fullname, specialization],
  );

  return result.rows[0];
}

export async function updateDoctor(userid: string, fullname: string, specialization: string) {
  const result = await pool.query(
    `UPDATE doctor
     SET fullname = $1, specialization = $2
     WHERE userid = $3
     RETURNING *`,
    [fullname, specialization, userid],
  );

  return result.rows[0];
}

export async function getDoctorByUserId(userid: string) {
  const result = await pool.query(
    `SELECT * FROM doctor WHERE userid = $1`,
    [userid],
  );

  return result.rows[0];
}
