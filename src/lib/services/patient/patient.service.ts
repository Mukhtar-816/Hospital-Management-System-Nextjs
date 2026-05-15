import { pool } from "@/lib/db";
import { PoolClient } from "pg";

export async function createPatient(userid: string, data: any, client?: PoolClient) {
  const db = client || pool;
  const { fullname, address, gender, patientnumber, location } = data;
  
  // location is expected to be [lat, lng] or null
  const locationPoint = location ? `(${location[0]},${location[1]})` : null;

  const result = await db.query(
    `INSERT INTO patient (userid, fullname, address, gender, patientnumber, location)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userid, fullname, address, gender, patientnumber, locationPoint],
  );

  return result.rows[0];
}

export async function updatePatient(userid: string, data: any) {
  const { fullname, address, gender, patientnumber, patientid, location } = data;
  const locationPoint = location ? `(${location[0]},${location[1]})` : null;

  const result = patientid
    ? await pool.query(
      `UPDATE patient
         SET fullname = $1, address = $2, gender = $3, patientnumber = $4, location = $5
         WHERE patientid = $6 RETURNING *`,
      [fullname, address, gender, patientnumber, locationPoint, patientid],
    )
    : await pool.query(
      `UPDATE patient
         SET fullname = $1, address = $2, gender = $3, patientnumber = $4, location = $5
         WHERE userid = $6 RETURNING *`,
      [fullname, address, gender, patientnumber, locationPoint, userid],
    );

  return result.rows[0];
}



export async function getPatientByUserId(userid: string) {
  const result = await pool.query(
    `SELECT * FROM patient WHERE userid = $1`,
    [userid],
  );

  const patient = result.rows[0];
  if (patient && patient.location) {
    // Transform POINT(x, y) object to [lat, lng] array
    patient.location = [patient.location.x, patient.location.y];
  }
  return patient;
}


export async function getAllPatients() {
  const result = await pool.query(
    `SELECT p.*, u.useremail FROM patient p JOIN users u ON p.userid = u.userid`,
  );

  return result.rows.map(row => {
    if (row.location) {
      row.location = [row.location.x, row.location.y];
    }
    return row;
  });
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