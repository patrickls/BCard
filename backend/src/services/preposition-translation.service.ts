import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { PrepositionTranslationEntity } from "../models/preposition-translation.entity";
import { HttpError } from "../middlewares/error-handler.middleware";
import { pickRound } from "../utils/random-pick.util";

export class PrepositionTranslationService {
  private repository: Repository<PrepositionTranslationEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PrepositionTranslationEntity);
  }

  async getRandomRound(
    count: number = 1,
    excludeIds: string[] = []
  ): Promise<{ items: PrepositionTranslationEntity[]; cycleReset: boolean }> {
    const pool = await this.repository.find();
    return pickRound(pool, count, excludeIds);
  }

  async getAllItems(): Promise<PrepositionTranslationEntity[]> {
    return this.repository.find({ order: { portuguese: "ASC" } });
  }

  async findById(id: string): Promise<PrepositionTranslationEntity> {
    const item = await this.repository.findOneBy({ id });
    if (!item) throw new HttpError(404, "Tradução de preposição não encontrada");
    return item;
  }
}
