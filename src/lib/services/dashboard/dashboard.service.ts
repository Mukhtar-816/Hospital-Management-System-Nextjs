import { pool } from "@/lib/db";

export async function getDoctorDashboardData(userId: string) {
  const statsQuery = `
    SELECT
      COUNT(*) FILTER (WHERE starttime::date = CURRENT_DATE) as today_appointments,
      COUNT(*) FILTER (WHERE status = 'completed') as patients_seen,
      COUNT(*) FILTER (WHERE status = 'in_progress') as pending_records
    FROM appointment
    WHERE doctorid = (SELECT doctorid FROM doctor WHERE userid = $1)
  `;

  const nextPatientQuery = `
    SELECT 
      a.appointmentid,
      a.starttime,
      p.fullname as patientname,
      p.gender,
      a.type,
      a.status
    FROM appointment a
    JOIN patient p ON a.patientid = p.patientid
    WHERE a.doctorid = (SELECT doctorid FROM doctor WHERE userid = $1) 
    AND a.status IN ('checked_in', 'in_progress')
    ORDER BY CASE WHEN a.status = 'in_progress' THEN 0 ELSE 1 END, a.starttime ASC
    LIMIT 1
  `;

  const [statsRes, nextPatientRes, doctorRes] = await Promise.all([
    pool.query(statsQuery, [userId]),
    pool.query(nextPatientQuery, [userId]),
    pool.query("SELECT fullname FROM doctor WHERE userid = $1", [userId])
  ]);

  return {
    doctor: doctorRes.rows[0],
    stats: statsRes.rows[0],
    nextPatient: nextPatientRes.rows[0] || null
  };
}

export async function getPatientDashboardData(userId: string) {
  const statsQuery = `
    SELECT
      COUNT(*) as total_requests,
      COUNT(*) FILTER (WHERE status = 'scheduled' AND starttime > NOW()) as upcoming_appointments,
      COUNT(*) FILTER (WHERE status = 'completed') as past_visits
    FROM appointment
    WHERE patientid = (SELECT patientid FROM patient WHERE userid = $1)
  `;

  const nextAppQuery = `
    SELECT 
      a.appointmentid,
      a.starttime,
      d.fullname as doctorname,
      a.type
    FROM appointment a
    JOIN doctor d ON a.doctorid = d.doctorid
    WHERE a.patientid = (SELECT patientid FROM patient WHERE userid = $1) 
    AND a.status = 'scheduled' 
    AND a.starttime > NOW()
    ORDER BY a.starttime ASC
    LIMIT 1
  `;

  const activityQuery = `
  SELECT * FROM (
    (SELECT 
      'Appointment' as type, 
      a.starttime as date, 
      a.status as status, -- Prefix added here
      'Appointment with ' || d.fullname as title,
      a.appointmentid::text as id
     FROM appointment a 
     JOIN doctor d ON a.doctorid = d.doctorid
     WHERE a.patientid = (SELECT patientid FROM patient WHERE userid = $1))
    UNION ALL
    (SELECT 
      'Record' as type, 
      i.createdat as date, 
      'info' as status, 
      'Medical record updated' as title,
      i.interactionid::text as id
     FROM interaction i 
     JOIN appointment a ON i.appointmentid = a.appointmentid
     WHERE a.patientid = (SELECT patientid FROM patient WHERE userid = $1))
  ) as combined_activity
  ORDER BY date DESC
  LIMIT 5
`;

  const [statsRes, nextAppRes, activityRes] = await Promise.all([
    pool.query(statsQuery, [userId]),
    pool.query(nextAppQuery, [userId]),
    pool.query(activityQuery, [userId])
  ]);

  return {
    stats: statsRes.rows[0],
    nextAppointment: nextAppRes.rows[0] || null,
    activity: activityRes.rows
  };
}