import { pool, withTransaction } from "@/lib/db";
import { PoolClient } from "pg";

export async function createUser(email: string, password: string, client?: PoolClient) {
  const db = client || pool;
  const result = await db.query(
    `INSERT INTO users (useremail, userpassword) VALUES ($1, $2) RETURNING *`,
    [email, password]
  );
  return result.rows[0];
}

export async function findByEmail(email: string) {
  const result = await pool.query(`SELECT * FROM users WHERE useremail = $1`, [email]);
  return result.rows[0];
}

export async function findById(userid: string) {
  const result = await pool.query(
    `SELECT userid, useremail, createdat, updatedat FROM users WHERE userid = $1`,
    [userid]
  );
  return result.rows[0] ?? null;
}

export async function assignRole(userid: string, roleName: string, client?: PoolClient) {
  const db = client || pool;
  const roleRes = await db.query(`SELECT roleid FROM role WHERE name = $1`, [roleName]);
  if (roleRes.rows.length === 0) throw new Error(`Role ${roleName} not found`);
  const roleId = roleRes.rows[0].roleid;
  await db.query(`DELETE FROM userrole WHERE userid = $1`, [userid]);
  await db.query(`INSERT INTO userrole (userid, roleid) VALUES ($1, $2)`, [userid, roleId]);
}

export async function createFullUser(data: {
  email: string;
  passwordHash: string;
  role: string;
  profileData: any;
  profileCreator: (client: PoolClient, userid: string, data: any) => Promise<any>;
}) {
  return await withTransaction(async (client) => {
    const user = await createUser(data.email, data.passwordHash, client);
    await assignRole(user.userid, data.role, client);
    await data.profileCreator(client, user.userid, data.profileData);
    return user;
  });
}

export async function getUserRoles(userid: string): Promise<string[]> {
  const result = await pool.query(
    `SELECT r.name FROM role r JOIN userrole ur ON r.roleid = ur.roleid WHERE ur.userid = $1`,
    [userid]
  );
  return result.rows.map((row) => row.name);
}

export async function getMe(userid: string) {
  const user = await findById(userid);
  if (!user) return null;
  const userrole = await getUserRoles(userid);
  const role = userrole[0] ?? "";
  return { ...user, role };
}

export async function getUsersForAdminDashboard() {
  const result = await pool.query(`
    SELECT
      u.userid,
      u.useremail,
      r.name AS role,
      COALESCE(d.fullname, rec.fullname, p.fullname) AS fullname,
      p.address,
      p.gender,
      p.patientid,
      d.specialization,
      d.doctorid,
      rec.receptionistid
    FROM users u
    JOIN userrole ur ON u.userid = ur.userid
    JOIN role r ON ur.roleid = r.roleid
    LEFT JOIN doctor d ON d.userid = u.userid
    LEFT JOIN receptionist rec ON rec.userid = u.userid
    LEFT JOIN patient p ON p.userid = u.userid
    ORDER BY u.createdat DESC
  `);
  return result.rows;
}