import { Router } from "express";
import userRoutes from "./user.routes";
import verbRoutes from "./verb.routes";
import prepositionTranslationRoutes from "./preposition-translation.routes";
import prepositionRequiredUsageRoutes from "./preposition-required-usage.routes";
import prepositionToForRoutes from "./preposition-to-for.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ data: { status: "ok" }, error: null });
});

router.use("/users", userRoutes);
router.use("/verbs", verbRoutes);
router.use("/prepositions/translations", prepositionTranslationRoutes);
router.use("/prepositions/required-usage", prepositionRequiredUsageRoutes);
router.use("/prepositions/to-for", prepositionToForRoutes);

export default router;
