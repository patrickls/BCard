import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { PrepositionInOnAtEntity } from "../models/preposition-in-on-at.entity";
import { HttpError } from "../middlewares/error-handler.middleware";
import { pickRound } from "../utils/random-pick.util";

export type PrepositionInOnAtWithExplanation = PrepositionInOnAtEntity & { explanation: string };

const GROUP_EXPLANATIONS: Record<number, string> = {
  1: "Para especificar local da cidade.",
  2: "Para tratar de Time, Moment, Instant.",
  3: "Ideia de proximidade.",
  4: "Se você é bom ou ruim em alguma coisa.",
  5: "Meios de transporte usamos ON (exceção do carro, nesse caso se usa o IN).",
  6: "Quando falamos de dias.",
  7: "Quando queremos dizer que algo está sobre, em cima.",
  8: "Sempre que estamos tratando de algo elétrico/eletrônico.",
  9: "Significa dentro e é um wildcard, um coringa, usado sempre que não couber um dos outros.",
};

export class PrepositionInOnAtService {
  private repository: Repository<PrepositionInOnAtEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PrepositionInOnAtEntity);
  }

  async getRandomRound(
    count: number = 1,
    excludeIds: string[] = []
  ): Promise<{ items: PrepositionInOnAtWithExplanation[]; cycleReset: boolean }> {
    const pool = await this.repository.find();
    const { items, cycleReset } = pickRound(pool, count, excludeIds);
    return { items: items.map((item) => this.withExplanation(item)), cycleReset };
  }

  async getAllItems(): Promise<PrepositionInOnAtWithExplanation[]> {
    const items = await this.repository.find({ order: { groupNumber: "ASC", sentence: "ASC" } });
    return items.map((item) => this.withExplanation(item));
  }

  async findById(id: string): Promise<PrepositionInOnAtWithExplanation> {
    const item = await this.repository.findOneBy({ id });
    if (!item) throw new HttpError(404, "Item de 'in'/'on'/'at' não encontrado");
    return this.withExplanation(item);
  }

  private withExplanation(item: PrepositionInOnAtEntity): PrepositionInOnAtWithExplanation {
    return { ...item, explanation: GROUP_EXPLANATIONS[item.groupNumber] ?? "" };
  }
}
