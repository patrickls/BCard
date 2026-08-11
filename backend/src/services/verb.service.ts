import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { VerbEntity } from "../models/verb.entity";
import { HttpError } from "../middlewares/error-handler.middleware";

export class VerbService {
  private repository: Repository<VerbEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(VerbEntity);
  }

  async getRandomVerbs(count: number = 3): Promise<VerbEntity[]> {
    try {
      const verbs = await this.repository
        .createQueryBuilder("verb")
        .orderBy("RANDOM()")
        .take(count)
        .getMany();

      if (verbs.length > 0) {
        return verbs;
      }
    } catch (error) {
      console.warn("Aviso: Falha ao consultar o banco para verbos. Usando dados locais como fallback.", error);
    }

    // Fallback de verbos caso o banco não esteja inicializado
    return this.getFallbackVerbs(count);
  }

  async getAllVerbs(): Promise<VerbEntity[]> {
    try {
      const verbs = await this.repository.find({
        order: { portuguese: "ASC" },
      });
      if (verbs.length > 0) return verbs;
    } catch (error) {
      console.warn("Aviso: Falha ao consultar banco para todos os verbos. Usando fallback.", error);
    }

    return this.getFallbackVerbs(30);
  }

  async findById(id: string): Promise<VerbEntity> {
    const verb = await this.repository.findOneBy({ id });
    if (!verb) throw new HttpError(404, "Verbo não encontrado");
    return verb;
  }

  private getFallbackVerbs(count: number): VerbEntity[] {
    const defaultVerbs: Array<Omit<VerbEntity, "createdAt" | "updatedAt">> = [
      { id: "1", portuguese: "Ir", infinitive: "go", pastSimple: "went", pastParticiple: "gone" },
      { id: "2", portuguese: "Vir", infinitive: "come", pastSimple: "came", pastParticiple: "come" },
      { id: "3", portuguese: "Fazer", infinitive: "do", pastSimple: "did", pastParticiple: "done" },
      { id: "4", portuguese: "Ter", infinitive: "have", pastSimple: "had", pastParticiple: "had" },
      { id: "5", portuguese: "Ver", infinitive: "see", pastSimple: "saw", pastParticiple: "seen" },
      { id: "6", portuguese: "Correr", infinitive: "run", pastSimple: "ran", pastParticiple: "run" },
      { id: "7", portuguese: "Escrever", infinitive: "write", pastSimple: "wrote", pastParticiple: "written" },
      { id: "8", portuguese: "Ler", infinitive: "read", pastSimple: "read", pastParticiple: "read" },
      { id: "9", portuguese: "Pegar / Tomar", infinitive: "take", pastSimple: "took", pastParticiple: "taken" },
      { id: "10", portuguese: "Dar", infinitive: "give", pastSimple: "gave", pastParticiple: "given" },
      { id: "11", portuguese: "Comer", infinitive: "eat", pastSimple: "ate", pastParticiple: "eaten" },
      { id: "12", portuguese: "Beber", infinitive: "drink", pastSimple: "drank", pastParticiple: "drunk" },
      { id: "13", portuguese: "Falar", infinitive: "speak", pastSimple: "spoke", pastParticiple: "spoken" },
      { id: "14", portuguese: "Comprar", infinitive: "buy", pastSimple: "bought", pastParticiple: "bought" },
      { id: "15", portuguese: "Vender", infinitive: "sell", pastSimple: "sold", pastParticiple: "sold" },
      { id: "16", portuguese: "Pensar", infinitive: "think", pastSimple: "thought", pastParticiple: "thought" },
      { id: "17", portuguese: "Encontrar", infinitive: "find", pastSimple: "found", pastParticiple: "found" },
      { id: "18", portuguese: "Quebrar", infinitive: "break", pastSimple: "broke", pastParticiple: "broken" },
      { id: "19", portuguese: "Construir", infinitive: "build", pastSimple: "built", pastParticiple: "built" },
      { id: "20", portuguese: "Trazer", infinitive: "bring", pastSimple: "brought", pastParticiple: "brought" },
      { id: "21", portuguese: "Escolher", infinitive: "choose", pastSimple: "chose", pastParticiple: "chosen" },
      { id: "22", portuguese: "Voar", infinitive: "fly", pastSimple: "flew", pastParticiple: "flown" },
      { id: "23", portuguese: "Esquecer", infinitive: "forget", pastSimple: "forgot", pastParticiple: "forgotten" },
      { id: "24", portuguese: "Conhecer / Encontrar", infinitive: "meet", pastSimple: "met", pastParticiple: "met" },
      { id: "25", portuguese: "Pagar", infinitive: "pay", pastSimple: "paid", pastParticiple: "paid" },
      { id: "26", portuguese: "Enviar", infinitive: "send", pastSimple: "sent", pastParticiple: "sent" },
      { id: "27", portuguese: "Nadar", infinitive: "swim", pastSimple: "swam", pastParticiple: "swum" },
      { id: "28", portuguese: "Ensinar", infinitive: "teach", pastSimple: "taught", pastParticiple: "taught" },
      { id: "29", portuguese: "Entender", infinitive: "understand", pastSimple: "understood", pastParticiple: "understood" },
      { id: "30", portuguese: "Dizer", infinitive: "say", pastSimple: "said", pastParticiple: "said" },
    ];

    const shuffled = [...defaultVerbs].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const now = new Date();
    return selected.map((v) => ({
      ...v,
      createdAt: now,
      updatedAt: now,
    })) as VerbEntity[];
  }
}
