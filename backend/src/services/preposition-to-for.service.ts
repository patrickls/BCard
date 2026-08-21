import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { PrepositionToForEntity } from "../models/preposition-to-for.entity";
import { HttpError } from "../middlewares/error-handler.middleware";
import { pickRound } from "../utils/random-pick.util";

export type PrepositionToForWithExplanation = PrepositionToForEntity & { explanation: string };

const GROUP_EXPLANATIONS: Record<number, string> = {
  1: "Quando for possível substituir a preposição por “para” e “a/ao” o TO deve ser usado, quando não couber o “a/ao”, deve ser usado o “FOR”. Verifique a grafia, você pode ter errado ao escrever alguma palavra.",
  2: "Caso exista um objeto na frase é necessário utilização da preposição, caso não haja, não se utiliza preposição. Verifique a grafia, você pode ter errado ao escrever alguma palavra.",
};

export class PrepositionToForService {
  private repository: Repository<PrepositionToForEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PrepositionToForEntity);
  }

  async getRandomRound(
    count: number = 1,
    excludeIds: string[] = []
  ): Promise<{ items: PrepositionToForWithExplanation[]; cycleReset: boolean }> {
    const pool = await this.repository.find();
    const { items, cycleReset } = pickRound(pool, count, excludeIds);
    return { items: items.map((item) => this.withExplanation(item)), cycleReset };
  }

  async getAllItems(): Promise<PrepositionToForWithExplanation[]> {
    const items = await this.repository.find({ order: { groupNumber: "ASC", sentencePt: "ASC" } });
    return items.map((item) => this.withExplanation(item));
  }

  async findById(id: string): Promise<PrepositionToForWithExplanation> {
    const item = await this.repository.findOneBy({ id });
    if (!item) throw new HttpError(404, "Item de 'to'/'for' não encontrado");
    return this.withExplanation(item);
  }

  private withExplanation(item: PrepositionToForEntity): PrepositionToForWithExplanation {
    return { ...item, explanation: GROUP_EXPLANATIONS[item.groupNumber] ?? "" };
  }
}
