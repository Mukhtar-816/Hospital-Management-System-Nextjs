import { createPatientService } from "./service";

export async function createPatient(req) {
    const body = await req.json();

    // basic validation
    if (!body.patientNumber) {
        return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const patient = await createPatientService(body);

    return Response.json(patient);
}