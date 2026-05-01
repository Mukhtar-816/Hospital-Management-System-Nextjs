import { pool } from "@/lib/db";

interface CreateAppointmentParams {
  patientid: string;
  doctorid: string;
  receptionistid: string;
  starttime: string;
  type: string;
  requestid?: string | null;
}

/**
 * Creates a new appointment record after verifying doctor availability.
 */
export async function createAppointment(data: CreateAppointmentParams) {
  const { patientid, doctorid, receptionistid, starttime, type, requestid } = data;
  // 1. Calculate endtime (Default 30-minute slot)
  const isoStartTime = starttime.includes(' ') ? starttime.replace(' ', 'T') : starttime;

  const start = new Date(isoStartTime);

  // Check if the date is actually valid before calling .getTime()
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid starttime format received: ${starttime}`);
  }

  const endtime = new Date(start.getTime() + 30 * 60000).toISOString();

  // 2. Conflict Check
  // Ensure the doctor isn't already booked for this exact start time
  const conflict = await pool.query(
    "SELECT 1 FROM appointment WHERE doctorid = $1 AND starttime = $2 AND status != 'cancelled'",
    [doctorid, starttime]
  );

  if (conflict.rows.length > 0) {
    throw new Error("Conflict: Doctor is already booked for this time slot.");
  }

  // 3. Insert Record
  const result = await pool.query(
    `INSERT INTO appointment (
      patientid, 
      doctorid, 
      receptionistid, 
      requestid, 
      starttime, 
      endtime, 
      type, 
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled')
    RETURNING *`,
    [patientid, doctorid, receptionistid, requestid || null, starttime, endtime, type]
  );

  return result.rows[0];
}

/**
 * Retrieves all appointments with basic patient and doctor details.
 */
export async function getAllAppointments() {
  const result = await pool.query(`
    SELECT 
      a.appointmentid as id,
      p.fullname as patientname,
      d.fullname as doctorname,
      a.starttime as scheduledat,
      a.status
    FROM appointment a
    JOIN patient p ON a.patientid = p.patientid
    JOIN doctor d ON a.doctorid = d.doctorid
    ORDER BY a.starttime DESC
  `);

  return result.rows;
}

/**
 * Retrieves appointments for a specific doctor.
 */
export async function getAppointmentsByDoctorId(doctorid: string) {
  const result = await pool.query(`
    SELECT 
      appointmentid as "appointmentId",
      patientid as "patientId",
      doctorid as "doctorId",
      starttime as "scheduledAt",
      status
    FROM appointment
    WHERE doctorid = $1
    ORDER BY starttime DESC
  `, [doctorid]);

  return result.rows;
}

/**
 * Retrieves appointments for a specific patient.
 */
export async function getAppointmentsByPatientId(patientid: string) {
  const result = await pool.query(`
    SELECT 
      appointmentid as "appointmentId",
      patientid as "patientId",
      doctorid as "doctorId",
      starttime as "scheduledAt",
      status
    FROM appointment
    WHERE patientid = $1
    ORDER BY starttime DESC
  `, [patientid]);

  return result.rows;
}

/**
 * Retrieves a single appointment by its ID.
 */
export async function getAppointmentById(id: string) {
  const result = await pool.query(
    `SELECT * FROM appointment WHERE appointmentid = $1`,
    [id]
  );
  return result.rows[0];
}

/**
 * Updates status from 'scheduled' to 'checked_in'.
 * Allowed only for receptionists.
 */
export async function checkinAppointment(id: string) {
  const appointment = await getAppointmentById(id);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status !== 'scheduled') {
    throw new Error(`Invalid transition: cannot check-in from status '${appointment.status}'`);
  }

  const result = await pool.query(
    `UPDATE appointment SET status = 'checked_in' WHERE appointmentid = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

/**
 * Updates status from 'checked_in' to 'in_progress' and sets starttime to NOW().
 * Allowed only for doctors.
 */
export async function startAppointment(id: string) {
  const appointment = await getAppointmentById(id);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status !== 'checked_in') {
    throw new Error(`Invalid transition: cannot start from status '${appointment.status}'`);
  }

  const result = await pool.query(
    `UPDATE appointment SET status = 'in_progress', starttime = NOW() WHERE appointmentid = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

/**
 * Updates status from 'in_progress' to 'completed' and sets endtime to NOW().
 * Allowed only for doctors.
 */
export async function completeAppointment(id: string) {
  const appointment = await getAppointmentById(id);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status !== 'in_progress') {
    throw new Error(`Invalid transition: cannot complete from status '${appointment.status}'`);
  }

  const result = await pool.query(
    `UPDATE appointment SET status = 'completed', endtime = NOW() WHERE appointmentid = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

/**
 * Updates status from 'scheduled' to 'no_show'.
 * Allowed only for receptionists.
 */
export async function noShowAppointment(id: string) {
  const appointment = await getAppointmentById(id);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status !== 'scheduled') {
    throw new Error(`Invalid transition: cannot set no-show from status '${appointment.status}'`);
  }

  const result = await pool.query(
    `UPDATE appointment SET status = 'no_show' WHERE appointmentid = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}