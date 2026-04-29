import { pool } from "@/lib/db";

export async function createUser(email: string, password: string) {
  const result = await pool.query(
    `INSERT INTO users (useremail, userpassword)
     VALUES ($1, $2)
     RETURNING *`,
    [email, password]
  );

  return result.rows[0];
}

export async function findByEmail(email: string) {
  const result = await pool.query(
    `SELECT * FROM users WHERE useremail = $1`,
    [email]
  );

  return result.rows[0];
}

export async function findById(userId: string) {
  const result = await pool.query(
    `SELECT userid, useremail, createdat, updatedat FROM users WHERE userid = $1`,
    [userId]
  );

  return result.rows[0] ?? null;
}

export async function assignRole(userId: string, roleName: string) {
  const roleRes = await pool.query(
    `SELECT roleid FROM role WHERE name = $1`,
    [roleName]
  );

  const roleId = roleRes.rows[0].roleid;

  await pool.query(
    `INSERT INTO userrole (userid, roleid) VALUES ($1, $2)`,
    [userId, roleId]
  );
}

export async function getUserRoles(userId: string): Promise<string[]> {
  const result = await pool.query(
    `SELECT r.name
     FROM role r
     JOIN userrole ur ON r.roleid = ur.roleid
     WHERE ur.userid = $1`,
    [userId]
  );

  return result.rows.map((row) => row.name);
}

export async function getMe(userId: string) {
  const user = await findById(userId);

  if (!user) return null;

  const roles = await getUserRoles(userId);

  return { ...user, roles };
}