import { drizzle } from "drizzle-orm/node-postgres";
import * as pg from "pg";
const { Pool } = pg;
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pgSchema } from "drizzle-orm/pg-core";

export const clinicSchema = pgSchema("iatropolis");
const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "tudorpostgresql",
  password: "tudorpostgresqlpassword",
  database: "clinicdb",
});

export const drizzleInstance = drizzle(pool);

export async function migrateToDb() {
  await migrate(drizzleInstance, { migrationsFolder: "drizzle" });
}
