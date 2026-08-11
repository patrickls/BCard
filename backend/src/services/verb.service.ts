import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { VerbEntity } from "../models/verb.entity";
import { HttpError } from "../middlewares/error-handler.middleware";

export class VerbService {
  private repository: Repository<VerbEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(VerbEntity);
  }

  /**
   * Sorteia uma rodada de verbos dentro do escopo (list) informado, evitando repetir
   * um verbo já exibido (excludeIds) até que todos os verbos do escopo tenham aparecido.
   * cycleReset=true indica que o ciclo de "já exibidos" foi reiniciado nesta rodada -
   * o caller deve descartar o histórico de exclusão anterior e recomeçar a partir
   * dos verbos retornados.
   */
  async getRandomVerbs(
    count: number = 3,
    list?: string,
    excludeIds: string[] = []
  ): Promise<{ verbs: VerbEntity[]; cycleReset: boolean }> {
    try {
      let query = this.repository.createQueryBuilder("verb");

      if (list) {
        query = query.where("verb.list = :list", { list });
      }

      const pool = await query.getMany();

      if (pool.length > 0) {
        return this.pickRound(pool, count, excludeIds);
      }
    } catch (error) {
      console.warn("Aviso: Falha ao consultar o banco para verbos. Usando dados locais como fallback.", error);
    }

    // Fallback de verbos caso o banco não esteja inicializado
    return this.pickRound(this.getFallbackPool(list), count, excludeIds);
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

    return this.getFallbackPool();
  }

  async findById(id: string): Promise<VerbEntity> {
    const verb = await this.repository.findOneBy({ id });
    if (!verb) throw new HttpError(404, "Verbo não encontrado");
    return verb;
  }

  /**
   * Escolhe os verbos de uma rodada a partir do pool elegível (já filtrado por lista),
   * excluindo os ids já exibidos no ciclo atual. Quando o pool restante não tem verbos
   * suficientes para completar a rodada, reinicia o ciclo: completa a rodada puxando do
   * pool inteiro (sem repetir um verbo dentro da mesma rodada) e sinaliza cycleReset.
   */
  private pickRound(
    pool: VerbEntity[],
    count: number,
    excludeIds: string[]
  ): { verbs: VerbEntity[]; cycleReset: boolean } {
    const shuffle = <T>(items: T[]): T[] => [...items].sort(() => 0.5 - Math.random());
    const excludeSet = new Set(excludeIds);
    const remaining = pool.filter((v) => !excludeSet.has(v.id));

    if (remaining.length >= count) {
      return { verbs: shuffle(remaining).slice(0, count), cycleReset: false };
    }

    const shuffledRemaining = shuffle(remaining);
    const usedIds = new Set(shuffledRemaining.map((v) => v.id));
    const fillPool = pool.filter((v) => !usedIds.has(v.id));
    const needed = count - shuffledRemaining.length;
    const fill = shuffle(fillPool).slice(0, needed);

    return { verbs: [...shuffledRemaining, ...fill], cycleReset: true };
  }

  private getFallbackPool(list?: string): VerbEntity[] {
    const defaultVerbs: Array<Omit<VerbEntity, "createdAt" | "updatedAt">> = [
      // Lista 2
      { id: "1", portuguese: "Esconder", infinitive: "hide", pastSimple: "hid", pastParticiple: "hidden", list: "Lista 2" },
      { id: "2", portuguese: "Bater", infinitive: "hit", pastSimple: "hit", pastParticiple: "hit", list: "Lista 2" },
      { id: "3", portuguese: "Segurar", infinitive: "hold", pastSimple: "held", pastParticiple: "held", list: "Lista 2" },
      { id: "4", portuguese: "Machucar", infinitive: "hurt", pastSimple: "hurt", pastParticiple: "hurt", list: "Lista 2" },
      { id: "5", portuguese: "Manter", infinitive: "keep", pastSimple: "kept", pastParticiple: "kept", list: "Lista 2" },
      { id: "6", portuguese: "Ajoelhar", infinitive: "kneel", pastSimple: "knelt", pastParticiple: "knelt", list: "Lista 2" },
      { id: "7", portuguese: "Saber", infinitive: "know", pastSimple: "knew", pastParticiple: "known", list: "Lista 2" },
      { id: "8", portuguese: "Pôr", infinitive: "lay", pastSimple: "laid", pastParticiple: "laid", list: "Lista 2" },
      { id: "9", portuguese: "Conduzir", infinitive: "lead", pastSimple: "led", pastParticiple: "led", list: "Lista 2" },
      { id: "10", portuguese: "Pular", infinitive: "leap", pastSimple: "leapt / leaped", pastParticiple: "leapt / leaped", list: "Lista 2" },
      { id: "11", portuguese: "Aprender", infinitive: "learn", pastSimple: "learnt / learned", pastParticiple: "learnt / learned", list: "Lista 2" },
      { id: "12", portuguese: "Deixar", infinitive: "leave", pastSimple: "left", pastParticiple: "left", list: "Lista 2" },
      { id: "13", portuguese: "Emprestar", infinitive: "lend", pastSimple: "lent", pastParticiple: "lent", list: "Lista 2" },
      { id: "14", portuguese: "Deixar", infinitive: "let", pastSimple: "let", pastParticiple: "let", list: "Lista 2" },
      { id: "15", portuguese: "Deitar", infinitive: "lie", pastSimple: "lay", pastParticiple: "lain", list: "Lista 2" },
      { id: "16", portuguese: "Ascender", infinitive: "light", pastSimple: "lit", pastParticiple: "lit", list: "Lista 2" },
      { id: "17", portuguese: "Perder", infinitive: "lose", pastSimple: "lost", pastParticiple: "lost", list: "Lista 2" },
      { id: "18", portuguese: "Fazer", infinitive: "make", pastSimple: "made", pastParticiple: "made", list: "Lista 2" },
      { id: "19", portuguese: "Querer dizer", infinitive: "mean", pastSimple: "meant", pastParticiple: "meant", list: "Lista 2" },
      { id: "20", portuguese: "Encontrar", infinitive: "meet", pastSimple: "met", pastParticiple: "met", list: "Lista 2" },
      { id: "21", portuguese: "Pagar", infinitive: "pay", pastSimple: "paid", pastParticiple: "paid", list: "Lista 2" },
      { id: "22", portuguese: "Pôr", infinitive: "put", pastSimple: "put", pastParticiple: "put", list: "Lista 2" },
      { id: "23", portuguese: "Desistir", infinitive: "quit", pastSimple: "quit", pastParticiple: "quit", list: "Lista 2" },
      { id: "24", portuguese: "Ler", infinitive: "read", pastSimple: "read", pastParticiple: "read", list: "Lista 2" },
      { id: "25", portuguese: "Andar de/a", infinitive: "ride", pastSimple: "rode", pastParticiple: "ridden", list: "Lista 2" },
      { id: "26", portuguese: "Tocar", infinitive: "ring", pastSimple: "rang", pastParticiple: "rung", list: "Lista 2" },
      { id: "27", portuguese: "Aumentar", infinitive: "rise", pastSimple: "rose", pastParticiple: "risen", list: "Lista 2" },
      { id: "28", portuguese: "Correr", infinitive: "run", pastSimple: "ran", pastParticiple: "run", list: "Lista 2" },
      { id: "29", portuguese: "Dizer", infinitive: "say", pastSimple: "said", pastParticiple: "said", list: "Lista 2" },
      { id: "30", portuguese: "Ver", infinitive: "see", pastSimple: "saw", pastParticiple: "seen", list: "Lista 2" },
      { id: "31", portuguese: "Procurar", infinitive: "seek", pastSimple: "sought", pastParticiple: "sought", list: "Lista 2" },
      { id: "32", portuguese: "Vender", infinitive: "sell", pastSimple: "sold", pastParticiple: "sold", list: "Lista 2" },
      { id: "33", portuguese: "Enviar", infinitive: "send", pastSimple: "sent", pastParticiple: "sent", list: "Lista 2" },
      { id: "34", portuguese: "Pôr", infinitive: "set", pastSimple: "set", pastParticiple: "set", list: "Lista 2" },
      { id: "35", portuguese: "Chacoalhar", infinitive: "shake", pastSimple: "shook", pastParticiple: "shaken", list: "Lista 2" },
      { id: "36", portuguese: "Derramar", infinitive: "shed", pastSimple: "shed", pastParticiple: "shed", list: "Lista 2" },
      { id: "37", portuguese: "Brilhar", infinitive: "shine", pastSimple: "shone / shined", pastParticiple: "shone / shined", list: "Lista 2" },
      { id: "38", portuguese: "Atirar", infinitive: "shoot", pastSimple: "shot", pastParticiple: "shot", list: "Lista 2" },
      { id: "39", portuguese: "Mostrar", infinitive: "show", pastSimple: "showed", pastParticiple: "shown", list: "Lista 2" },
      { id: "40", portuguese: "Triturar", infinitive: "shred", pastSimple: "shredded", pastParticiple: "shredded", list: "Lista 2" },
      { id: "41", portuguese: "Encolher", infinitive: "shrink", pastSimple: "shrank", pastParticiple: "shrunk", list: "Lista 2" },
      { id: "42", portuguese: "Fechar", infinitive: "shut", pastSimple: "shut", pastParticiple: "shut", list: "Lista 2" },
      { id: "43", portuguese: "Cantar", infinitive: "sing", pastSimple: "sang", pastParticiple: "sung", list: "Lista 2" },
      { id: "44", portuguese: "Afundar", infinitive: "sink", pastSimple: "sank", pastParticiple: "sunk", list: "Lista 2" },
      { id: "45", portuguese: "Sentar", infinitive: "sit", pastSimple: "sat", pastParticiple: "sat", list: "Lista 2" },
      { id: "46", portuguese: "Dormir", infinitive: "sleep", pastSimple: "slept", pastParticiple: "slept", list: "Lista 2" },

      // Lista 1
      { id: "47", portuguese: "Ser", infinitive: "be", pastSimple: "was / were", pastParticiple: "been", list: "Lista 1" },
      { id: "48", portuguese: "Estar", infinitive: "be", pastSimple: "was / were", pastParticiple: "been", list: "Lista 1" },
      { id: "49", portuguese: "Ter", infinitive: "have", pastSimple: "had", pastParticiple: "had", list: "Lista 1" },
      { id: "50", portuguese: "Aguentar", infinitive: "bear", pastSimple: "bore", pastParticiple: "born", list: "Lista 1" },
      { id: "51", portuguese: "Derrotar", infinitive: "beat", pastSimple: "beat", pastParticiple: "beaten", list: "Lista 1" },
      { id: "52", portuguese: "Tornar-se", infinitive: "become", pastSimple: "became", pastParticiple: "become", list: "Lista 1" },
      { id: "53", portuguese: "Começar", infinitive: "begin", pastSimple: "began", pastParticiple: "begun", list: "Lista 1" },
      { id: "54", portuguese: "Dobrar", infinitive: "bend", pastSimple: "bent", pastParticiple: "bent", list: "Lista 1" },
      { id: "55", portuguese: "Apostar", infinitive: "bet", pastSimple: "bet", pastParticiple: "bet", list: "Lista 1" },
      { id: "56", portuguese: "Morder", infinitive: "bite", pastSimple: "bit", pastParticiple: "bitten", list: "Lista 1" },
      { id: "57", portuguese: "Sangrar", infinitive: "bleed", pastSimple: "bled", pastParticiple: "bled", list: "Lista 1" },
      { id: "58", portuguese: "Soprar", infinitive: "blow", pastSimple: "blew", pastParticiple: "blown", list: "Lista 1" },
      { id: "59", portuguese: "Quebrar", infinitive: "break", pastSimple: "broke", pastParticiple: "broken", list: "Lista 1" },
      { id: "60", portuguese: "Trazer", infinitive: "bring", pastSimple: "brought", pastParticiple: "brought", list: "Lista 1" },
      { id: "61", portuguese: "Construir", infinitive: "build", pastSimple: "built", pastParticiple: "built", list: "Lista 1" },
      { id: "62", portuguese: "Queimar", infinitive: "burn", pastSimple: "burnt", pastParticiple: "burnt", list: "Lista 1" },
      { id: "63", portuguese: "Arrebentar", infinitive: "burst", pastSimple: "burst", pastParticiple: "burst", list: "Lista 1" },
      { id: "64", portuguese: "Comprar", infinitive: "buy", pastSimple: "bought", pastParticiple: "bought", list: "Lista 1" },
      { id: "65", portuguese: "Arremessar", infinitive: "cast", pastSimple: "cast", pastParticiple: "cast", list: "Lista 1" },
      { id: "66", portuguese: "Pegar", infinitive: "catch", pastSimple: "caught", pastParticiple: "caught", list: "Lista 1" },
      { id: "67", portuguese: "Escolher", infinitive: "choose", pastSimple: "chose", pastParticiple: "chosen", list: "Lista 1" },
      { id: "68", portuguese: "Vir", infinitive: "come", pastSimple: "came", pastParticiple: "come", list: "Lista 1" },
      { id: "69", portuguese: "Custar", infinitive: "cost", pastSimple: "cost", pastParticiple: "cost", list: "Lista 1" },
      { id: "70", portuguese: "Rastejar", infinitive: "creep", pastSimple: "crept", pastParticiple: "crept", list: "Lista 1" },
      { id: "71", portuguese: "Cortar", infinitive: "cut", pastSimple: "cut", pastParticiple: "cut", list: "Lista 1" },
      { id: "72", portuguese: "Lidar", infinitive: "deal", pastSimple: "dealt", pastParticiple: "dealt", list: "Lista 1" },
      { id: "73", portuguese: "Cavar", infinitive: "dig", pastSimple: "dug", pastParticiple: "dug", list: "Lista 1" },
      { id: "74", portuguese: "Fazer", infinitive: "do", pastSimple: "did", pastParticiple: "done", list: "Lista 1" },
      { id: "75", portuguese: "Desenhar", infinitive: "draw", pastSimple: "drew", pastParticiple: "drawn", list: "Lista 1" },
      { id: "76", portuguese: "Beber", infinitive: "drink", pastSimple: "drank", pastParticiple: "drunk", list: "Lista 1" },
      { id: "77", portuguese: "Dirigir", infinitive: "drive", pastSimple: "drove", pastParticiple: "driven", list: "Lista 1" },
      { id: "78", portuguese: "Comer", infinitive: "eat", pastSimple: "ate", pastParticiple: "eaten", list: "Lista 1" },
      { id: "79", portuguese: "Cair", infinitive: "fall", pastSimple: "fell", pastParticiple: "fallen", list: "Lista 1" },
      { id: "80", portuguese: "Alimentar", infinitive: "feed", pastSimple: "fed", pastParticiple: "fed", list: "Lista 1" },
      { id: "81", portuguese: "Sentir", infinitive: "feel", pastSimple: "felt", pastParticiple: "felt", list: "Lista 1" },
      { id: "82", portuguese: "Lutar", infinitive: "fight", pastSimple: "fought", pastParticiple: "fought", list: "Lista 1" },
      { id: "83", portuguese: "Achar", infinitive: "find", pastSimple: "found", pastParticiple: "found", list: "Lista 1" },
      { id: "84", portuguese: "Fugir", infinitive: "flee", pastSimple: "fled", pastParticiple: "fled", list: "Lista 1" },
      { id: "85", portuguese: "Voar", infinitive: "fly", pastSimple: "flew", pastParticiple: "flown", list: "Lista 1" },
      { id: "86", portuguese: "Esquecer", infinitive: "forget", pastSimple: "forgot", pastParticiple: "forgotten", list: "Lista 1" },
      { id: "87", portuguese: "Perdoar", infinitive: "forgive", pastSimple: "forgave", pastParticiple: "forgiven", list: "Lista 1" },
      { id: "88", portuguese: "Congelar", infinitive: "freeze", pastSimple: "froze", pastParticiple: "frozen", list: "Lista 1" },
      { id: "89", portuguese: "Chegar", infinitive: "get", pastSimple: "got", pastParticiple: "gotten", list: "Lista 1" },
      { id: "90", portuguese: "Dar", infinitive: "give", pastSimple: "gave", pastParticiple: "given", list: "Lista 1" },
      { id: "91", portuguese: "Ir", infinitive: "go", pastSimple: "went", pastParticiple: "gone", list: "Lista 1" },
      { id: "92", portuguese: "Crescer", infinitive: "grow", pastSimple: "grew", pastParticiple: "grown", list: "Lista 1" },
      { id: "93", portuguese: "Pendurar", infinitive: "hang", pastSimple: "hung", pastParticiple: "hung", list: "Lista 1" },
      { id: "94", portuguese: "Ouvir", infinitive: "hear", pastSimple: "heard", pastParticiple: "heard", list: "Lista 1" },
    ];

    let filtered = defaultVerbs;
    if (list) {
      filtered = defaultVerbs.filter((v) => v.list === list);
    }

    const now = new Date();
    return filtered.map((v) => ({
      ...v,
      createdAt: now,
      updatedAt: now,
    })) as VerbEntity[];
  }
}
