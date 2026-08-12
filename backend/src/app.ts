import "reflect-metadata";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";

const app = express();

const allowedOrigins = ["https://bcardapp.vercel.app", "http://localhost:4200"];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

export default app;
