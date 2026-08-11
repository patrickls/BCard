import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { AppDataSource } from "./config/database";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`API rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Falha ao conectar no banco de dados:", err);
    process.exit(1);
  });
