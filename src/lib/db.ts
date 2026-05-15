import { Pool, type PoolClient } from "pg";
import { devError, devLog } from "@/lib/logger";

const globalForPG = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForPG.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost")
      ? false
      : {
          rejectUnauthorized: true,
        },
  });

if (!globalForPG.pool) {
  globalForPG.pool = pool;

  pool
    .connect()
    .then((client) => {
      client.release();
    })
    .catch((err) => {
      devError(" PostgreSQL connection error:", err);
    });
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
