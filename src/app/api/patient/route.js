import { createPatient } from "@/features/patient/controller";

export async function POST(req) {
    return createPatient(req);
}