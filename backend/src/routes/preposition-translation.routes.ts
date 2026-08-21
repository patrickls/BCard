import { Router } from "express";
import { PrepositionTranslationController } from "../controllers/preposition-translation.controller";

const router = Router();
const controller = new PrepositionTranslationController();

router.get("/random", controller.getRandom);
router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;
