import { pool } from "@/lib/db";

export async function getAdminStats() {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM doctor) as total_doctors,
      (SELECT COUNT(*) FROM patient) as total_patients,
      (SELECT COUNT(*) FROM receptionist) as total_receptionists,
      (SELECT COUNT(*) FROM appointment) as total_appointments,
      (SELECT COUNT(*) FROM appointment WHERE status = 'completed') as completed_appointments,
      (SELECT COUNT(*) FROM appointment WHERE status = 'scheduled') as scheduled_appointments,
      (SELECT COUNT(*) FROM appointment WHERE status = 'no_show') as no_show_appointments,
      (SELECT COUNT(*) FROM appointment WHERE status = 'cancelled') as cancelled_appointments,
      (SELECT COUNT(*) FROM interaction) as total_interactions,
      (SELECT COUNT(*) FROM appointmentrequest) as total_requests,
      (SELECT COUNT(*) FROM appointmentrequest WHERE status = 'approved') as approved_requests,
      (SELECT COUNT(*) FROM appointmentrequest WHERE status = 'rejected') as rejected_requests,
      (SELECT COUNT(*) FROM appointmentrequest WHERE status = 'pending') as pending_requests
  `;

  const res = await pool.query(statsQuery);
  return res.rows[0];
}

export async function getAdminAppointmentAnalytics() {
  const statusQuery = `
    SELECT status, COUNT(*) as count 
    FROM appointment 
    GROUP BY status
  `;

  const requestStatusQuery = `
    SELECT status, COUNT(*) as count 
    FROM appointmentrequest 
    GROUP BY status
  `;

  const doctorPerformanceQuery = `
    SELECT 
      d.fullname as doctorname,
      COUNT(a.appointmentid) as total_appointments,
      COUNT(a.appointmentid) FILTER (WHERE a.status = 'completed') as completed_count,
      COUNT(a.appointmentid) FILTER (WHERE a.status = 'no_show') as no_show_count
    FROM doctor d
    LEFT JOIN appointment a ON d.doctorid = a.doctorid
    GROUP BY d.doctorid, d.fullname
    ORDER BY total_appointments DESC
    LIMIT 10
  `;

  const [statusRes, requestRes, doctorRes] = await Promise.all([
    pool.query(statusQuery),
    pool.query(requestStatusQuery),
    pool.query(doctorPerformanceQuery)
  ]);

  return {
    appointmentsByStatus: statusRes.rows,
    requestsByStatus: requestRes.rows,
    doctorPerformance: doctorRes.rows
  };
}
