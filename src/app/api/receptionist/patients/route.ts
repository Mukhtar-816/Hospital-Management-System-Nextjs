import { NextRequest, NextResponse } from "next/server";
import { getUser } from "src/lib/auth/getUser";
import { getUserRoleAndPermissions, requirePermission } from "src/lib/auth/permission";
import { getAllPatients } from "src/lib/services/patient/patient.service";

export async function GET(req: NextRequest) {
    try {
        const decoded = await getUser(req) as { userid: string };
        if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const access = await getUserRoleAndPermissions(decoded.userid);
        requirePermission("patient.read", access);

        const patients = await getAllPatients();
        return NextResponse.json(patients);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}