import { devError, devLog } from "@/lib/logger";
import { pool } from "../db";

export interface UserRoleAndPermissions {
  role: string;
  permissions: string[];
}

export async function getUserRoleAndPermissions(
  userid: string,
): Promise<UserRoleAndPermissions | null> {
  try {
    const roleRes = await pool.query(
      `SELECT r.name
       FROM role r
       JOIN userrole ur ON r.roleid = ur.roleid
       WHERE ur.userid = $1`,
      [userid],
    );

    if (roleRes.rows.length === 0) return null;

    const roleName = roleRes.rows[0].name;

    const permRes = await pool.query(
      `SELECT p.name
       FROM permission p
       JOIN rolepermission rp ON p.permissionid = rp.permissionid
       JOIN role r ON rp.roleid = r.roleid
       WHERE r.name = $1`,
      [roleName],
    );

    const permissions = permRes.rows.map((row) => row.name);

    return { role: roleName, permissions };
  } catch (error) {
    devError("getUserRoleAndPermissions Error:", error);
    return null;
  }
}

export function requirePermission(permission: string, user: any) {
  if (user?.role === "admin") return;
  if (!user?.permissions?.includes(permission)) {
    throw new Error("Forbidden");
  }
}
