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


export async function searchDoctorsForAppointment(filters: {
  specialization?: string;
  appointmentTime?: string;
}) {
  const { specialization, appointmentTime } = filters;
  const values: any[] = [appointmentTime];

  // Using double quotes for camelCase column names from your ERD
  let sql = `
    SELECT 
      d.doctorid, 
      d.fullname, 
      d.specialization,
      CASE 
        WHEN a.appointmentid IS NOT NULL THEN TRUE 
        ELSE FALSE 
      END as is_busy
    FROM doctor d
    LEFT JOIN Appointment a ON d.doctorid = a.doctorid 
      AND a.starttime = $1::TIMESTAMP 
      AND a.status NOT IN ('cancelled', 'rejected')
    WHERE 1=1
  `;

  if (specialization) {
    values.push(specialization);
    sql += ` AND d.specialization = $${values.length}`;
  }

  const result = await pool.query(sql, values);
  return result.rows;
}