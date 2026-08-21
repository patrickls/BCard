import { Router } from "express";
import { PrepositionInOnAtController } from "../controllers/preposition-in-on-at.controller";

const router = Router();
const controller = new PrepositionInOnAtController();

router.get("/random", controller.getRandom);
router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;
