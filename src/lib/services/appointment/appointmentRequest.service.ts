import { pool } from "@/lib/db";

export interface AppointmentRequest {
  requestid: string;
  patientid: string;
  preferredtime: string;
  symptoms: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
  createdat: string;
  updatedat: string;
}

export async function createAppointmentRequest(data: {
  patientid: string;
  preferredtime: string;
  symptoms: string;
  priority: string;
}) {
  const { patientid, preferredtime, symptoms, priority } = data;
  const result = await pool.query(
    `INSERT INTO appointmentrequest (patientid, preferredtime, symptoms, priority, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [patientid, preferredtime, symptoms, priority],
  );
  return result.rows[0];
}

export async function getAppointmentRequests() {
  const result = await pool.query(`
    SELECT 
      ar.*,
      p.fullname as patientname
    FROM appointmentrequest ar
    JOIN patient p ON ar.patientid = p.patientid
    ORDER BY ar.createdat DESC
  `);
  return result.rows;
}

export async function getAppointmentRequestsByPatientId(patientid: string) {
  const result = await pool.query(
    `
    SELECT 
      ar.*
    FROM appointmentrequest ar
    WHERE ar.patientid = $1
    ORDER BY ar.createdat DESC
  `,
    [patientid],
  );
  return result.rows;
}

export async function updateAppointmentRequestStatus(
  id: string,
  status: "approved" | "rejected",
) {
  const result = await pool.query(
    `UPDATE appointmentrequest SET status = $1, updatedat = NOW() WHERE requestid = $2 RETURNING *`,
    [status, id],
  );
  return result.rows[0];
}

export async function getAppointmentRequestById(id: string) {
  const result = await pool.query(
    `SELECT * FROM appointmentrequest WHERE requestid = $1`,
    [id],
  );
  return result.rows[0];
}
