import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { UserEntity } from "../models/user.entity";
import { HttpError } from "../middlewares/error-handler.middleware";

// Toda regra de negócio vive aqui. Único ponto que fala com o Repository.
// Agnóstico de HTTP — não conhece req/res (seção 3 do CLAUDE.md).
export class UserService {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return user;
  }

  create(data: Pick<UserEntity, "name" | "email">): Promise<UserEntity> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<Pick<UserEntity, "name" | "email">>): Promise<UserEntity> {
    const user = await this.findById(id);
    Object.assign(user, data);
    return this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.repository.remove(user);
  }
}
