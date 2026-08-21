import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { PrepositionRequiredUsageEntity } from "../models/preposition-required-usage.entity";
import { HttpError } from "../middlewares/error-handler.middleware";
import { pickRound } from "../utils/random-pick.util";

export class PrepositionRequiredUsageService {
  private repository: Repository<PrepositionRequiredUsageEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PrepositionRequiredUsageEntity);
  }

  async getRandomRound(
    count: number = 1,
    excludeIds: string[] = []
  ): Promise<{ items: PrepositionRequiredUsageEntity[]; cycleReset: boolean }> {
    const pool = await this.repository.find();
    return pickRound(pool, count, excludeIds);
  }

  async getAllItems(): Promise<PrepositionRequiredUsageEntity[]> {
    return this.repository.find({ order: { word: "ASC" } });
  }

  async findById(id: string): Promise<PrepositionRequiredUsageEntity> {
    const item = await this.repository.findOneBy({ id });
    if (!item) throw new HttpError(404, "Uso obrigatório de preposição não encontrado");
    return item;
  }
}
