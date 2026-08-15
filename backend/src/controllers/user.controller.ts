import { NextFunction, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { HttpError } from "../middlewares/error-handler.middleware";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

async function validateDto<T extends object>(dtoClass: new () => T, body: unknown): Promise<T> {
  const dto = plainToInstance(dtoClass, body, { excludeExtraneousValues: false });
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
  if (errors.length > 0) {
    const message = errors.flatMap((e) => Object.values(e.constraints ?? {})).join("; ");
    throw new HttpError(400, message || "Dados inválidos");
  }
  return dto;
}

// Recebe o request, valida input (formato), chama o Service, formata o response.
// Não acessa o repository diretamente e não contém regra de negócio (seção 3).
export class UserController {
  private service = new UserService();

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.findAllForRequester(req.userId!);
      res.json({ data: users, error: null });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.findById(req.params.id, req.userId!);
      res.json({ data: user, error: null });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const dto = await validateDto(CreateUserDto, req.body);
      const user = await this.service.create({ name: dto.name, email: dto.email });
      res.status(201).json({ data: user, error: null });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const dto = await validateDto(UpdateUserDto, req.body);
      const user = await this.service.update(req.params.id, dto, req.userId!);
      res.json({ data: user, error: null });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
