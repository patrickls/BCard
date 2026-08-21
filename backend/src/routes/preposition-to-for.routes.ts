import { Router } from "express";
import { PrepositionToForController } from "../controllers/preposition-to-for.controller";

const router = Router();
const controller = new PrepositionToForController();

router.get("/random", controller.getRandom);
router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;
