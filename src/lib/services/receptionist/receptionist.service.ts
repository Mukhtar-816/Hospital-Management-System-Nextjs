import { pool } from "@/lib/db";

export async function createReceptionist(userid: string, fullname: string) {
  const result = await pool.query(
    `INSERT INTO receptionist (userid, fullname)
     VALUES ($1, $2)
     RETURNING *`,
    [userid, fullname],
  );

  return result.rows[0];
}

export async function updateReceptionist(userid: string, fullname: string) {
  const result = await pool.query(
    `UPDATE receptionist
     SET fullname = $1
     WHERE userid = $2
     RETURNING *`,
    [fullname, userid],
  );

  return result.rows[0];
}

export async function getReceptionistByUserId(userid: string) {
  const result = await pool.query(
    `SELECT * FROM receptionist WHERE userid = $1`,
    [userid],
  );

  return result.rows[0];
}