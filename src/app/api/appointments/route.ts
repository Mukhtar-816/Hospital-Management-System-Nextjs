import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
    getUserRoleAndPermissions,
    requirePermission,
} from "@/lib/auth/permission";
import * as appointmentService from "@/lib/services/appointment/appointment.service";

export async function POST(req: Request) {
    try {
        // 1. Auth & Permission Check
        const decoded = getUser(req) as { userid: string };
        const access = await getUserRoleAndPermissions(decoded.userid);
        if (!access) {
            throw new Error("Forbidden");
        }
        // Requiring permission to create appointments
        requirePermission("appointment.create", access);

        // 2. Parse Body
        const body = await req.json();
        const {
            patientid,
            doctorid,
            starttime,
            type,
            requestid
        } = body;

        // 3. Service Layer Call
        // Logic for endtime and conflict checks should live in appointmentService
        const appointment = await appointmentService.createAppointment({
            patientid,
            doctorid,
            receptionistid: decoded.userid, // From the decoded token
            starttime,
            type: type || "walk-in",
            requestid: requestid || null
        });

        return Response.json({ success: true, appointmentid: appointment.appointmentid });
    } catch (err: any) {
        console.error("CREATE APPOINTMENT ERROR:", err);
        return NextResponse.json(
            { error: err.message || "Failed to create appointment" },
            { status: err.message === "Forbidden" ? 403 : 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const decoded = getUser(req) as { userid: string };
        const access = await getUserRoleAndPermissions(decoded.userid);
        if (!access) {
            throw new Error("Forbidden");
        }
        requirePermission("appointment.read", access);

        const appointments = await appointmentService.getAllAppointments();

        return Response.json({ success: true, appointments });
    } catch (err: any) {
        console.error("GET APPOINTMENTS ERROR:", err);
        return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
    }
}