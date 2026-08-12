import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

// Runtime usa o pooler do Supabase (porta 6543, pgbouncer). Migrations usam
// conexão direta (porta 5432) via DATABASE_URL_MIGRATIONS — pgbouncer não
// suporta prepared statements exigidos pelo TypeORM ao migrar.
const isMigrationRun = process.argv.some((arg) => arg.includes("typeorm-ts-node-commonjs"));

// Glob relativo a __dirname (não a process.cwd()) e cobrindo .ts/.js: roda tanto
// em dev (tsx/ts-node direto sobre src/*.ts) quanto compilado (node sobre dist/*.js,
// caso do backend/api/index.ts serverless na Vercel, que carrega o build do tsc).
export const AppDataSource = new DataSource({
  type: "postgres",
  url: isMigrationRun ? process.env.DATABASE_URL_MIGRATIONS : process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [path.join(__dirname, "../models/**/*.entity.{ts,js}")],
  migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
});
