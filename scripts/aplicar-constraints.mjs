// Aplica db/constraints.sql no banco de DIRECT_URL (a conexão pooled não é
// confiável para DDL). Uso: npm run db:constraints
import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";

const sql = await readFile(new URL("../db/constraints.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: process.env.DIRECT_URL });

await client.connect();
try {
  await client.query(sql);
  const { rows } = await client.query(
    "SELECT count(*)::int AS total FROM pg_constraint WHERE contype = 'c' AND conname LIKE 'ck\\_%'"
  );
  console.log(`Constraints CHECK aplicadas: ${rows[0].total}`);
} finally {
  await client.end();
}
