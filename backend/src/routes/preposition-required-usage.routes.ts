import { Router } from "express";
import { PrepositionRequiredUsageController } from "../controllers/preposition-required-usage.controller";

const router = Router();
const controller = new PrepositionRequiredUsageController();

router.get("/random", controller.getRandom);
router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;
