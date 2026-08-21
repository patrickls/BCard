import { NextFunction, Request, Response } from "express";
import { PrepositionToForService } from "../services/preposition-to-for.service";

export class PrepositionToForController {
  private service = new PrepositionToForService();

  getRandom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = req.query.count ? parseInt(req.query.count as string, 10) : 1;
      const limit = isNaN(count) || count < 1 ? 1 : Math.min(count, 12);
      const excludeIds = req.query.excludeIds
        ? (req.query.excludeIds as string).split(",").map((id) => id.trim()).filter(Boolean)
        : [];

      const { items, cycleReset } = await this.service.getRandomRound(limit, excludeIds);
      res.json({ data: items, error: null, cycleReset });
    } catch (err) {
      next(err);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getAllItems();
      res.json({ data: items, error: null });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.findById(req.params.id);
      res.json({ data: item, error: null });
    } catch (err) {
      next(err);
    }
  };
}
