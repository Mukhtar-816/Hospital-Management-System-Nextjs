import { NextRequest, NextResponse } from "next/server";
import { pool } from "src/lib/db";
import { getUserFromRequest } from "src/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const currentUser: any = await getUserFromRequest(request);

    // ✅ Proper permission check
    if (!currentUser || !currentUser.permissions.includes("update_user")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    // ✅ Single delete (CASCADE handles rest)
    const result = await client.query(
      `DELETE FROM users WHERE userid = $1 RETURNING userid`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}