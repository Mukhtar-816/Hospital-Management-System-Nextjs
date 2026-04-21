import { prisma } from "@/lib/prisma";

export async function createPatientService(data) {
    return prisma.patient.create({
        data,
    });
}