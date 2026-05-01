import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { requirePermission } from "@/lib/auth/permission";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { searchDoctorsForAppointment } from "@/lib/services/doctor/doctor.service";

export async function GET(req: Request) {
    try {
        const decoded = await getUser(req) as { userid: string } | null;
        if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check if user has permission to book/view appointments
        const access = await getUserRoleAndPermissions(decoded.userid);
        requirePermission("appointment.create", access);

        const { searchParams } = new URL(req.url);
        const specialization = searchParams.get("specialization") || undefined;
        const appointmentTime = searchParams.get("time") || undefined;

        if (!appointmentTime) {
            return NextResponse.json({ error: "Time is required for conflict check" }, { status: 400 });
        }

        const doctors = await searchDoctorsForAppointment({
            specialization,
            appointmentTime
        });

        return NextResponse.json({ doctors });
    } catch (err: any) {
        console.error("SEARCH_DOCTORS_ERROR:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}