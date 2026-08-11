import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Único ponto de formatação de erro (ver seção 6 do CLAUDE.md) — Controllers e
// Services lançam HttpError (ou deixam o erro subir) em vez de responder direto.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof Error ? err.message : "Erro interno";

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ data: null, error: message });
}
