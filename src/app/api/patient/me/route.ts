import { devLog, devError } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { getPatientByUserId, updatePatient } from "@/lib/services/patient/patient.service";
import { getUser } from "src/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "src/lib/auth/permission";
import { findById } from "src/lib/services/user/user.service";

export async function GET(req: NextRequest) {
    try {
        const decoded = await getUser(req) as { userid: string } | null;
        if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const access = await getUserRoleAndPermissions(decoded.userid);
        requirePermission("patient.read", access);

        const user = await findById(decoded.userid);
        const patient = await getPatientByUserId(decoded.userid);
        if (!patient || !user) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        return NextResponse.json({ ...patient, ...user });

    } catch (error: any) {
        devLog(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const decoded = await getUser(req) as { userid: string } | null;
        if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const access = await getUserRoleAndPermissions(decoded.userid);
        requirePermission("profile.update", access);

        const user = await findById(decoded.userid);
        const patient = await getPatientByUserId(decoded.userid);
        if (!patient || !user) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

        const data = await req.json();
        const updatedPatient = await updatePatient(decoded.userid, data);
        if (!updatedPatient) return NextResponse.json({ error: "Patient not updated" }, { status: 500 });

        return NextResponse.json({ ...updatedPatient, ...user });

    } catch (error: any) {
        devLog(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}