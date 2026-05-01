import { Pool } from "pg";

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
      console.error(" PostgreSQL connection error:", err);
    });
}
