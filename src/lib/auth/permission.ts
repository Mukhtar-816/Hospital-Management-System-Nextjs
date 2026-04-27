import { pool } from "../db";

export interface UserRoleAndPermissions {
  role: string;
  permissions: string[];
}

export async function getUserRoleAndPermissions(userId: string): Promise<UserRoleAndPermissions | null> {
  const client = await pool.connect();
  try {
    const roleRes = await client.query(
      `SELECT r.name 
       FROM Role r
       JOIN UserRole ur ON r.roleId = ur.roleId
       WHERE ur.userId = $1`,
      [userId]
    );

    if (roleRes.rows.length === 0) return null;

    const roleName = roleRes.rows[0].name;

    const permRes = await client.query(
      `SELECT p.name
       FROM Permission p
       JOIN RolePermission rp ON p.permissionId = rp.permissionId
       JOIN Role r ON rp.roleId = r.roleId
       WHERE r.name = $1`,
      [roleName]
    );

    const permissions = permRes.rows.map(row => row.name);

    return {
      role: roleName,
      permissions
    };
  } catch (error) {
    console.error("Error fetching RBAC:", error);
    return null;
  } finally {
    client.release();
  }
}

export function requirePermission(permission: string, user: any) {
  if (!user?.permissions?.includes(permission)) {
    throw new Error("Forbidden");
  }
}
