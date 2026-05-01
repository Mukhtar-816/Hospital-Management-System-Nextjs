import { getUser } from "@/lib/auth/getUser";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const decoded = getUser(req) as { userid: string };
    const userid = decoded.userid;

    const result = await pool.query("SELECT * FROM patient WHERE userid = $1", [
      userid,
    ]);

    if (result.rows.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
