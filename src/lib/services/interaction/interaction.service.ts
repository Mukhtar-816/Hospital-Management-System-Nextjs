import { pool } from "@/lib/db";

export async function saveClinicalData(appointmentId: string, data: {
  notes: string;
  diagnoses: string[];
  prescriptions: {
    medicine: string;
    frequency: string;
    duration: string;
    instructions: string
  }[];
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Create Interaction record
    const interactionRes = await client.query(
      `INSERT INTO interaction (appointmentid, notes) 
       VALUES ($1, $2) RETURNING interactionid`,
      [appointmentId, data.notes]
    );
    const interactionId = interactionRes.rows[0].interactionid;

    // 2. Batch insert diagnoses
    if (data.diagnoses.length > 0) {
      const diagValues = data.diagnoses.map((_, i) => `($1, $${i + 2})`).join(", ");
      await client.query(
        `INSERT INTO diagnosis (interactionid, description) VALUES ${diagValues}`,
        [interactionId, ...data.diagnoses]
      );
    }

    // 3. Batch insert prescriptions
    if (data.prescriptions.length > 0) {
      const prescValues = data.prescriptions.map((_, i) =>
        `($1, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, $${i * 4 + 5})`
      ).join(", ");

      const flattenedPresc = data.prescriptions.flatMap(p => [
        p.medicine,
        p.frequency,
        p.duration,
        p.instructions
      ]);

      await client.query(
        `INSERT INTO prescription (interactionid, medicine, frequency, duration, instructions) 
         VALUES ${prescValues}`,
        [interactionId, ...flattenedPresc]
      );
    }

    // 4. Update Appointment status
    await client.query(
      `UPDATE appointment SET status = 'completed' WHERE appointmentid = $1`,
      [appointmentId]
    );

    await client.query("COMMIT");
    return { interactionId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getInteractionByAppointment(appointmentId: string) {
  const query = `
    SELECT 
      i.interactionid, 
      i.notes,
      json_agg(DISTINCT jsonb_build_object('description', d.description)) FILTER (WHERE d.description IS NOT NULL) as diagnoses,
      json_agg(DISTINCT jsonb_build_object(
        'medicine', p.medicine,
        'frequency', p.frequency,
        'duration', p.duration,
        'instructions', p.instructions
      )) FILTER (WHERE p.medicine IS NOT NULL) as prescriptions
    FROM interaction i
    LEFT JOIN diagnosis d ON i.interactionid = d.interactionid
    LEFT JOIN prescription p ON i.interactionid = p.interactionid
    WHERE i.appointmentid = $1
    GROUP BY i.interactionid, i.notes
  `;
  const res = await pool.query(query, [appointmentId]);
  return res.rows[0] || null;
}
