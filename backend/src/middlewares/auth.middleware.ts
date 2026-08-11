import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./error-handler.middleware";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Valida o JWT emitido pelo Supabase Auth. A partir daqui, autorização
// (o que o usuário pode fazer) é regra de negócio e vive no Service (seção 8).
export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError(401, "Token não informado"));
  }

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) throw new Error("SUPABASE_JWT_SECRET não configurado");

    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, "Token inválido ou expirado"));
  }
}
