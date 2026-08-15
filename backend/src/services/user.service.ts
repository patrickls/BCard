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

  // Não existe papel de admin hoje — cada usuário autenticado só enxerga o próprio registro.
  async findAllForRequester(requesterId: string): Promise<UserEntity[]> {
    const user = await this.repository.findOneBy({ id: requesterId });
    return user ? [user] : [];
  }

  async findById(id: string, requesterId: string): Promise<UserEntity> {
    if (id !== requesterId) throw new HttpError(403, "Acesso negado a este recurso");
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new HttpError(404, "Usuário não encontrado");
    return user;
  }

  create(data: Pick<UserEntity, "name" | "email">): Promise<UserEntity> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(
    id: string,
    data: Partial<Pick<UserEntity, "name" | "email">>,
    requesterId: string,
  ): Promise<UserEntity> {
    const user = await this.findById(id, requesterId);
    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    return this.repository.save(user);
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const user = await this.findById(id, requesterId);
    await this.repository.remove(user);
  }
}
