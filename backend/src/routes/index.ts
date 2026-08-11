import { Router } from "express";
import userRoutes from "./user.routes";
import verbRoutes from "./verb.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ data: { status: "ok" }, error: null });
});

router.use("/users", userRoutes);
router.use("/verbs", verbRoutes);

export default router;
