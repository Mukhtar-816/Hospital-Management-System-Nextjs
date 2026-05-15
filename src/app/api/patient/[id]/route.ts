import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import {
  getUserRoleAndPermissions,
  requirePermission,
} from "@/lib/auth/permission";
import { pool } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decoded = getUser(req) as { userid: string };
    const access = await getUserRoleAndPermissions(decoded.userid);
    if (!access) throw new Error("Forbidden");

    const { id } = await params;

    const result = await pool.query(
      "SELECT * FROM patient WHERE patientid = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const patient = result.rows[0];

    // 1. If has 'patient.read_all', allow access
    const canReadAll = access.permissions.includes("patient.read_all");
    if (canReadAll) {
      return NextResponse.json({ patient });
    }

    // 2. Otherwise check 'patient.read' + Ownership
    requirePermission("patient.read", access);

    if (patient.userid !== decoded.userid) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own profile" },
        { status: 403 },
      );
    }

    return NextResponse.json({ patient });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: err?.message || "Something went wrong" },
      { status: 400 },
    );
  }
}
