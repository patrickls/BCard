import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

// Runtime usa o pooler do Supabase (porta 6543, pgbouncer). Migrations usam
// conexão direta (porta 5432) via DATABASE_URL_MIGRATIONS — pgbouncer não
// suporta prepared statements exigidos pelo TypeORM ao migrar.
const isMigrationRun = process.argv.some((arg) => arg.includes("typeorm-ts-node-commonjs"));

export const AppDataSource = new DataSource({
  type: "postgres",
  url: isMigrationRun ? process.env.DATABASE_URL_MIGRATIONS : process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: ["src/models/**/*.entity.ts"],
  migrations: ["src/migrations/**/*.ts"],
});
