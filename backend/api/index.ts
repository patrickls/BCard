import type { IncomingMessage, ServerResponse } from "http";

// Carrega o build já compilado pelo tsc (script "build" em package.json), não o
// código-fonte em src/. A Vercel processa arquivos de api/ com esbuild, que não
// emite os metadados de decorators (emitDecoratorMetadata) exigidos pelo TypeORM —
// por isso este arquivo não importa nenhum código com decorator diretamente, só
// carrega o resultado já compilado pelo tsc, que preserva esses metadados.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../dist/app").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppDataSource } = require("../dist/config/database");

// Reaproveita a conexão (e o pool do pgbouncer) entre invocações da mesma instância
// serverless "morna" — inicializar o DataSource a cada request seria caro e
// esgotaria as conexões do pooler do Supabase.
let initPromise: Promise<unknown> | null = null;

async function ensureDataSourceInitialized(): Promise<void> {
  if (AppDataSource.isInitialized) return;
  if (!initPromise) {
    initPromise = AppDataSource.initialize().catch((err: unknown) => {
      // Falhou: permite tentar de novo na próxima invocação em vez de travar
      // a função para sempre com uma promise rejeitada em cache.
      initPromise = null;
      throw err;
    });
  }
  await initPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await ensureDataSourceInitialized();
  app(req, res);
}
