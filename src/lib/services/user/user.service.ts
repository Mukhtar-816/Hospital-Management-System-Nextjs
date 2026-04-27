import { pool } from  "@/lib/db" ;

export async function createUser(email: string, password: string) {
  const result = await pool.query(
    `INSERT INTO  Users  (userEmail, userPassword)
     VALUES ($1, $2)
     RETURNING *`,
    [email, password]
  );

  return result.rows[0];
}

export async function findByEmail(email: string) {
  const result = await pool.query(
    `SELECT * FROM  users  WHERE  useremail  = $1`,
    [email]
  );

  return result.rows[0];
}

export async function assignRole(userId: string, roleName: string) {

  const roleRes = await pool.query(
    `SELECT  roleId  FROM  Role  WHERE  name  = $1`,
    [roleName]
  );

  const roleId = roleRes.rows[0].roleId;

  await pool.query(
    `INSERT INTO  UserRole  ( userId ,  roleId )
     VALUES ($1, $2)`,
    [userId, roleId]
  );
}