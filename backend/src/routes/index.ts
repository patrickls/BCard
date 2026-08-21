import { Router } from "express";
import userRoutes from "./user.routes";
import verbRoutes from "./verb.routes";
import prepositionTranslationRoutes from "./preposition-translation.routes";
import prepositionRequiredUsageRoutes from "./preposition-required-usage.routes";
import prepositionToForRoutes from "./preposition-to-for.routes";
import prepositionInOnAtRoutes from "./preposition-in-on-at.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ data: { status: "ok" }, error: null });
});

router.use("/users", userRoutes);
router.use("/verbs", verbRoutes);
router.use("/prepositions/translations", prepositionTranslationRoutes);
router.use("/prepositions/required-usage", prepositionRequiredUsageRoutes);
router.use("/prepositions/to-for", prepositionToForRoutes);
router.use("/prepositions/in-on-at", prepositionInOnAtRoutes);

export default router;
