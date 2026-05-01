import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserRoleAndPermissions } from "@/lib/auth/permission";
import { getAppointmentById } from "@/lib/services/appointment/appointment.service";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const decoded = getUser(req) as { userid: string };
        const access = await getUserRoleAndPermissions(decoded.userid);

        const appointment = await getAppointmentById(id);
        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        // Basic security: only doctor or patient involved can see it
        // Receptionists can see all (for check-in)
        const isReceptionist = access?.role === "receptionist";
        const isAuthorizedDoctor = access?.role === "doctor" && appointment.doctorid === access.id;
        const isAuthorizedPatient = access?.role === "patient" && appointment.patientid === access.id;

        if (!isReceptionist && !isAuthorizedDoctor && !isAuthorizedPatient) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ success: true, appointment });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
