import { NextFunction, Request, Response } from "express";
import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { HttpError } from "./error-handler.middleware";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Projeto usa o sistema novo de signing keys assimétricas do Supabase (ES256) —
// não existe SUPABASE_JWT_SECRET (HS256) pra esse projeto, então a validação
// busca a chave pública via JWKS a partir do `kid` no header do token.
const client = jwksClient({
  jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 10 * 60 * 1000,
  rateLimit: true,
});

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) return callback(err);
    callback(null, key.getPublicKey());
  });
}

// Valida o JWT emitido pelo Supabase Auth. A partir daqui, autorização
// (o que o usuário pode fazer) é regra de negócio e vive no Service (seção 8).
export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError(401, "Token não informado"));
  }

  jwt.verify(token, getKey, { algorithms: ["ES256"] }, (err, payload) => {
    if (err || !payload || typeof payload === "string") {
      return next(new HttpError(401, "Token inválido ou expirado"));
    }
    req.userId = payload.sub;
    next();
  });
}
