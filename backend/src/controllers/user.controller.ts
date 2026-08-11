import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";

// Recebe o request, valida input (formato), chama o Service, formata o response.
// Não acessa o repository diretamente e não contém regra de negócio (seção 3).
export class UserController {
  private service = new UserService();

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.findAll();
      res.json({ data: users, error: null });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.findById(req.params.id);
      res.json({ data: user, error: null });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body;
      const user = await this.service.create({ name, email });
      res.status(201).json({ data: user, error: null });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.update(req.params.id, req.body);
      res.json({ data: user, error: null });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
