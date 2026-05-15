import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "@/lib/auth/permission";
import { getAppointmentById, cancelAppointment } from "@/lib/services/appointment/appointment.service";
import { getPatientByUserId } from "@/lib/services/patient/patient.service";

import { getDoctorByUserId } from "@/lib/services/doctor/doctor.service";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const decoded = await getUser(req) as { userid: string };
        const access = await getUserRoleAndPermissions(decoded.userid);

        const appointment = await getAppointmentById(id);
        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        // 1. If has 'appointment.read_all', allow
        const canReadAll = access?.permissions.includes("appointment.read_all");
        if (canReadAll) {
            return NextResponse.json({ success: true, appointment });
        }

        // 2. Otherwise, check 'appointment.read' + Ownership
        requirePermission("appointment.read", access);
        
        const patient = await getPatientByUserId(decoded.userid);
        const doctor = await getDoctorByUserId(decoded.userid);

        const isOwner = (patient && patient.patientid === appointment.patientid) || 
                        (doctor && doctor.doctorid === appointment.doctorid);

        if (!isOwner) {
            return NextResponse.json({ error: "Forbidden: You do not own this appointment record" }, { status: 403 });
        }

        return NextResponse.json({ success: true, appointment });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const decoded = await getUser(req) as { userid: string };
        const access = await getUserRoleAndPermissions(decoded.userid);

        const appointment = await getAppointmentById(id);
        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        // 1. Only scheduled appointments can be cancelled
        if (appointment.status !== 'scheduled') {
            return NextResponse.json({ 
                error: `Cannot cancel an appointment that is already ${appointment.status}` 
            }, { status: 400 });
        }

        // 2. Check Permission
        const canDeleteAll = access?.permissions.includes("appointment.delete_all");
        if (!canDeleteAll) {
            requirePermission('appointment.delete', access);
            
            // Ownership Check for non-privileged users
            const patient = await getPatientByUserId(decoded.userid);
            if (!patient || patient.patientid !== appointment.patientid) {
                return NextResponse.json({ 
                    error: "Unauthorized: You can only cancel your own appointments" 
                }, { status: 403 });
            }
        }

        await cancelAppointment(id);
        return NextResponse.json({ success: true, message: "Appointment cancelled" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}



