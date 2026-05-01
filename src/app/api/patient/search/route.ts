import { searchPatients } from "src/lib/services/patient/patient.service";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (q.length < 2) {
        return Response.json({ patients: [] });
    }

    const patients = await searchPatients(q);
    return Response.json({ patients });
}