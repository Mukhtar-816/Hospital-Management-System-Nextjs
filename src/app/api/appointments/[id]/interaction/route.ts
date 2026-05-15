import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { devError, devLog } from "@/lib/logger";
import { getAppointmentById } from "@/lib/services/appointment/appointment.service";
import {
  getInteractionByAppointment,
  saveClinicalData,
} from "@/lib/services/interaction/interaction.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    requirePermission("clinical.read", access);

    const appointment = await getAppointmentById(id);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // const isAuthorized = (appointment.doctorid === access.id) || (appointment.patientid === access.id);

    // if (!isAuthorized) {
    //     return NextResponse.json({ error: "Forbidden: You do not have access to this record" }, { status: 403 });
    // }

    const interaction = await getInteractionByAppointment(id);
    if (!interaction) {
      return NextResponse.json(
        { error: "Interaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, interaction });
  } catch (err: any) {
    devError("GET INTERACTION ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch interaction" },
      { status: err.message === "Forbidden" ? 403 : 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);

    requirePermission("clinical.write", access);

    const body = await req.json();
    const { notes, diagnoses, prescriptions } = body;

    const result = await saveClinicalData(id, {
      notes,
      diagnoses,
      prescriptions: prescriptions.map((p: any) => ({
        medicine: p.medicine,
        frequency: p.frequency,
        duration: p.duration,
        instructions: p.instructions,
      })),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    devError("SAVE CLINICAL DATA ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save interaction" },
      { status: 500 },
    );
  }
}
