import { NextFunction, Request, Response } from "express";
import { VerbService } from "../services/verb.service";

export class VerbController {
  private service = new VerbService();

  getRandom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = req.query.count ? parseInt(req.query.count as string, 10) : 3;
      const limit = isNaN(count) || count < 1 ? 3 : Math.min(count, 30);
      const verbs = await this.service.getRandomVerbs(limit);
      res.json({ data: verbs, error: null });
    } catch (err) {
      next(err);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const verbs = await this.service.getAllVerbs();
      res.json({ data: verbs, error: null });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verb = await this.service.findById(req.params.id);
      res.json({ data: verb, error: null });
    } catch (err) {
      next(err);
    }
  };
}
