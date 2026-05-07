import { pool } from "@/lib/db";
import { PoolClient } from "pg";

export async function createPatient(userid: string, fullname: string, client?: PoolClient) {
  const db = client || pool;
  const result = await db.query(
    `INSERT INTO patient (userid, fullname)
     VALUES ($1, $2)
     RETURNING *`,
    [userid, fullname],
  );

  return result.rows[0];
}

export async function updatePatient(userid: string, data: any) {
  const { fullname, address, gender, patientnumber, patientid } = data;

  const result = patientid
    ? await pool.query(
      `UPDATE patient
         SET fullname = $1, address = $2, gender = $3, patientnumber = $4
         WHERE patientid = $5 RETURNING *`,
      [fullname, address, gender, patientnumber, patientid],
    )
    : await pool.query(
      `UPDATE patient
         SET fullname = $1, address = $2, gender = $3, patientnumber = $4
         WHERE userid = $5 RETURNING *`,
      [fullname, address, gender, patientnumber, userid],
    );

  return result.rows[0];
}


export async function getPatientByUserId(userid: string) {
  const result = await pool.query(
    `SELECT * FROM patient WHERE userid = $1`,
    [userid],
  );

  return result.rows[0];
}

export async function getAllPatients() {
  const result = await pool.query(
    `SELECT p.*, u.useremail FROM patient p JOIN users u ON p.userid = u.userid`,
  );

  return result.rows;
}


export async function searchPatients(query: string) {
  const searchTerm = `%${query}%`;

  const result = await pool.query(
    `
    SELECT 
      p.patientid, 
      p.fullname, 
      p.patientnumber, 
      u.useremail 
    FROM patient p
    JOIN users u ON p.userid = u.userid
    WHERE 
      p.fullname ILIKE $1 OR 
      u.useremail ILIKE $1 OR 
      p.patientnumber::text ILIKE $1  
    `,
    [searchTerm]
  );

  return result.rows;
}