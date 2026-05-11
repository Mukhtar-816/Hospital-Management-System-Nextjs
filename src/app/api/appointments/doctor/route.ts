import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import * as appointmentService from "@/lib/services/appointment/appointment.service";
import { getDoctorByUserId } from "@/lib/services/doctor/doctor.service";
import { getUserRoleAndPermissions, requirePermission } from "@/lib/auth/permission";

export async function GET(req: Request) {
    try {
        const decoded = getUser(req) as { userid: string };
        const access = await getUserRoleAndPermissions(decoded.userid);
        if (!access) throw new Error("Forbidden");
        requirePermission("appointment.read", access);
        
        const doctor = await getDoctorByUserId(decoded.userid);
        if (!doctor) {
            return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
        }

        const appointments = await appointmentService.getAppointmentsByDoctorId(doctor.doctorid);

        return NextResponse.json({ success: true, appointments });
    } catch (err: any) {
        console.error("GET DOCTOR APPOINTMENTS ERROR:", err);
        return NextResponse.json(
            { error: err.message || "Failed to fetch appointments" },
            { status: err.message === "Unauthorized" ? 401 : err.message === "Forbidden" ? 403 : 500 }
        );
    }
}
