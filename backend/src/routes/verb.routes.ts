import { Router } from "express";
import { VerbController } from "../controllers/verb.controller";

const router = Router();
const controller = new VerbController();

router.get("/random", controller.getRandom);
router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;
