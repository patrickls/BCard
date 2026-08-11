import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddListColumnAndReseedVerbs1723390000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "verbs"`);

    await queryRunner.addColumn(
      "verbs",
      new TableColumn({
        name: "list",
        type: "varchar",
        length: "50",
        isNullable: false,
      })
    );

    const verbsData = [
      // Lista 2
      { portuguese: "Esconder", infinitive: "hide", past_simple: "hid", past_participle: "hidden", list: "Lista 2" },
      { portuguese: "Bater", infinitive: "hit", past_simple: "hit", past_participle: "hit", list: "Lista 2" },
      { portuguese: "Segurar", infinitive: "hold", past_simple: "held", past_participle: "held", list: "Lista 2" },
      { portuguese: "Machucar", infinitive: "hurt", past_simple: "hurt", past_participle: "hurt", list: "Lista 2" },
      { portuguese: "Manter", infinitive: "keep", past_simple: "kept", past_participle: "kept", list: "Lista 2" },
      { portuguese: "Ajoelhar", infinitive: "kneel", past_simple: "knelt", past_participle: "knelt", list: "Lista 2" },
      { portuguese: "Saber", infinitive: "know", past_simple: "knew", past_participle: "known", list: "Lista 2" },
      { portuguese: "Pôr", infinitive: "lay", past_simple: "laid", past_participle: "laid", list: "Lista 2" },
      { portuguese: "Conduzir", infinitive: "lead", past_simple: "led", past_participle: "led", list: "Lista 2" },
      { portuguese: "Pular", infinitive: "leap", past_simple: "leapt / leaped", past_participle: "leapt / leaped", list: "Lista 2" },
      { portuguese: "Aprender", infinitive: "learn", past_simple: "learnt / learned", past_participle: "learnt / learned", list: "Lista 2" },
      { portuguese: "Deixar", infinitive: "leave", past_simple: "left", past_participle: "left", list: "Lista 2" },
      { portuguese: "Emprestar", infinitive: "lend", past_simple: "lent", past_participle: "lent", list: "Lista 2" },
      { portuguese: "Deixar", infinitive: "let", past_simple: "let", past_participle: "let", list: "Lista 2" },
      { portuguese: "Deitar", infinitive: "lie", past_simple: "lay", past_participle: "lain", list: "Lista 2" },
      { portuguese: "Ascender", infinitive: "light", past_simple: "lit", past_participle: "lit", list: "Lista 2" },
      { portuguese: "Perder", infinitive: "lose", past_simple: "lost", past_participle: "lost", list: "Lista 2" },
      { portuguese: "Fazer", infinitive: "make", past_simple: "made", past_participle: "made", list: "Lista 2" },
      { portuguese: "Querer dizer", infinitive: "mean", past_simple: "meant", past_participle: "meant", list: "Lista 2" },
      { portuguese: "Encontrar", infinitive: "meet", past_simple: "met", past_participle: "met", list: "Lista 2" },
      { portuguese: "Pagar", infinitive: "pay", past_simple: "paid", past_participle: "paid", list: "Lista 2" },
      { portuguese: "Pôr", infinitive: "put", past_simple: "put", past_participle: "put", list: "Lista 2" },
      { portuguese: "Desistir", infinitive: "quit", past_simple: "quit", past_participle: "quit", list: "Lista 2" },
      { portuguese: "Ler", infinitive: "read", past_simple: "read", past_participle: "read", list: "Lista 2" },
      { portuguese: "Andar de/a", infinitive: "ride", past_simple: "rode", past_participle: "ridden", list: "Lista 2" },
      { portuguese: "Tocar", infinitive: "ring", past_simple: "rang", past_participle: "rung", list: "Lista 2" },
      { portuguese: "Aumentar", infinitive: "rise", past_simple: "rose", past_participle: "risen", list: "Lista 2" },
      { portuguese: "Correr", infinitive: "run", past_simple: "ran", past_participle: "run", list: "Lista 2" },
      { portuguese: "Dizer", infinitive: "say", past_simple: "said", past_participle: "said", list: "Lista 2" },
      { portuguese: "Ver", infinitive: "see", past_simple: "saw", past_participle: "seen", list: "Lista 2" },
      { portuguese: "Procurar", infinitive: "seek", past_simple: "sought", past_participle: "sought", list: "Lista 2" },
      { portuguese: "Vender", infinitive: "sell", past_simple: "sold", past_participle: "sold", list: "Lista 2" },
      { portuguese: "Enviar", infinitive: "send", past_simple: "sent", past_participle: "sent", list: "Lista 2" },
      { portuguese: "Pôr", infinitive: "set", past_simple: "set", past_participle: "set", list: "Lista 2" },
      { portuguese: "Chacoalhar", infinitive: "shake", past_simple: "shook", past_participle: "shaken", list: "Lista 2" },
      { portuguese: "Derramar", infinitive: "shed", past_simple: "shed", past_participle: "shed", list: "Lista 2" },
      { portuguese: "Brilhar", infinitive: "shine", past_simple: "shone / shined", past_participle: "shone / shined", list: "Lista 2" },
      { portuguese: "Atirar", infinitive: "shoot", past_simple: "shot", past_participle: "shot", list: "Lista 2" },
      { portuguese: "Mostrar", infinitive: "show", past_simple: "showed", past_participle: "shown", list: "Lista 2" },
      { portuguese: "Triturar", infinitive: "shred", past_simple: "shredded", past_participle: "shredded", list: "Lista 2" },
      { portuguese: "Encolher", infinitive: "shrink", past_simple: "shrank", past_participle: "shrunk", list: "Lista 2" },
      { portuguese: "Fechar", infinitive: "shut", past_simple: "shut", past_participle: "shut", list: "Lista 2" },
      { portuguese: "Cantar", infinitive: "sing", past_simple: "sang", past_participle: "sung", list: "Lista 2" },
      { portuguese: "Afundar", infinitive: "sink", past_simple: "sank", past_participle: "sunk", list: "Lista 2" },
      { portuguese: "Sentar", infinitive: "sit", past_simple: "sat", past_participle: "sat", list: "Lista 2" },
      { portuguese: "Dormir", infinitive: "sleep", past_simple: "slept", past_participle: "slept", list: "Lista 2" },

      // Lista 1
      { portuguese: "Ser", infinitive: "be", past_simple: "was / were", past_participle: "been", list: "Lista 1" },
      { portuguese: "Estar", infinitive: "be", past_simple: "was / were", past_participle: "been", list: "Lista 1" },
      { portuguese: "Ter", infinitive: "have", past_simple: "had", past_participle: "had", list: "Lista 1" },
      { portuguese: "Aguentar", infinitive: "bear", past_simple: "bore", past_participle: "born", list: "Lista 1" },
      { portuguese: "Derrotar", infinitive: "beat", past_simple: "beat", past_participle: "beaten", list: "Lista 1" },
      { portuguese: "Tornar-se", infinitive: "become", past_simple: "became", past_participle: "become", list: "Lista 1" },
      { portuguese: "Começar", infinitive: "begin", past_simple: "began", past_participle: "begun", list: "Lista 1" },
      { portuguese: "Dobrar", infinitive: "bend", past_simple: "bent", past_participle: "bent", list: "Lista 1" },
      { portuguese: "Apostar", infinitive: "bet", past_simple: "bet", past_participle: "bet", list: "Lista 1" },
      { portuguese: "Morder", infinitive: "bite", past_simple: "bit", past_participle: "bitten", list: "Lista 1" },
      { portuguese: "Sangrar", infinitive: "bleed", past_simple: "bled", past_participle: "bled", list: "Lista 1" },
      { portuguese: "Soprar", infinitive: "blow", past_simple: "blew", past_participle: "blown", list: "Lista 1" },
      { portuguese: "Quebrar", infinitive: "break", past_simple: "broke", past_participle: "broken", list: "Lista 1" },
      { portuguese: "Trazer", infinitive: "bring", past_simple: "brought", past_participle: "brought", list: "Lista 1" },
      { portuguese: "Construir", infinitive: "build", past_simple: "built", past_participle: "built", list: "Lista 1" },
      { portuguese: "Queimar", infinitive: "burn", past_simple: "burnt", past_participle: "burnt", list: "Lista 1" },
      { portuguese: "Arrebentar", infinitive: "burst", past_simple: "burst", past_participle: "burst", list: "Lista 1" },
      { portuguese: "Comprar", infinitive: "buy", past_simple: "bought", past_participle: "bought", list: "Lista 1" },
      { portuguese: "Arremessar", infinitive: "cast", past_simple: "cast", past_participle: "cast", list: "Lista 1" },
      { portuguese: "Pegar", infinitive: "catch", past_simple: "caught", past_participle: "caught", list: "Lista 1" },
      { portuguese: "Escolher", infinitive: "choose", past_simple: "chose", past_participle: "chosen", list: "Lista 1" },
      { portuguese: "Vir", infinitive: "come", past_simple: "came", past_participle: "come", list: "Lista 1" },
      { portuguese: "Custar", infinitive: "cost", past_simple: "cost", past_participle: "cost", list: "Lista 1" },
      { portuguese: "Rastejar", infinitive: "creep", past_simple: "crept", past_participle: "crept", list: "Lista 1" },
      { portuguese: "Cortar", infinitive: "cut", past_simple: "cut", past_participle: "cut", list: "Lista 1" },
      { portuguese: "Lidar", infinitive: "deal", past_simple: "dealt", past_participle: "dealt", list: "Lista 1" },
      { portuguese: "Cavar", infinitive: "dig", past_simple: "dug", past_participle: "dug", list: "Lista 1" },
      { portuguese: "Fazer", infinitive: "do", past_simple: "did", past_participle: "done", list: "Lista 1" },
      { portuguese: "Desenhar", infinitive: "draw", past_simple: "drew", past_participle: "drawn", list: "Lista 1" },
      { portuguese: "Beber", infinitive: "drink", past_simple: "drank", past_participle: "drunk", list: "Lista 1" },
      { portuguese: "Dirigir", infinitive: "drive", past_simple: "drove", past_participle: "driven", list: "Lista 1" },
      { portuguese: "Comer", infinitive: "eat", past_simple: "ate", past_participle: "eaten", list: "Lista 1" },
      { portuguese: "Cair", infinitive: "fall", past_simple: "fell", past_participle: "fallen", list: "Lista 1" },
      { portuguese: "Alimentar", infinitive: "feed", past_simple: "fed", past_participle: "fed", list: "Lista 1" },
      { portuguese: "Sentir", infinitive: "feel", past_simple: "felt", past_participle: "felt", list: "Lista 1" },
      { portuguese: "Lutar", infinitive: "fight", past_simple: "fought", past_participle: "fought", list: "Lista 1" },
      { portuguese: "Achar", infinitive: "find", past_simple: "found", past_participle: "found", list: "Lista 1" },
      { portuguese: "Fugir", infinitive: "flee", past_simple: "fled", past_participle: "fled", list: "Lista 1" },
      { portuguese: "Voar", infinitive: "fly", past_simple: "flew", past_participle: "flown", list: "Lista 1" },
      { portuguese: "Esquecer", infinitive: "forget", past_simple: "forgot", past_participle: "forgotten", list: "Lista 1" },
      { portuguese: "Perdoar", infinitive: "forgive", past_simple: "forgave", past_participle: "forgiven", list: "Lista 1" },
      { portuguese: "Congelar", infinitive: "freeze", past_simple: "froze", past_participle: "frozen", list: "Lista 1" },
      { portuguese: "Chegar", infinitive: "get", past_simple: "got", past_participle: "gotten", list: "Lista 1" },
      { portuguese: "Dar", infinitive: "give", past_simple: "gave", past_participle: "given", list: "Lista 1" },
      { portuguese: "Ir", infinitive: "go", past_simple: "went", past_participle: "gone", list: "Lista 1" },
      { portuguese: "Crescer", infinitive: "grow", past_simple: "grew", past_participle: "grown", list: "Lista 1" },
      { portuguese: "Pendurar", infinitive: "hang", past_simple: "hung", past_participle: "hung", list: "Lista 1" },
      { portuguese: "Ouvir", infinitive: "hear", past_simple: "heard", past_participle: "heard", list: "Lista 1" },
    ];

    for (const verb of verbsData) {
      await queryRunner.query(
        `INSERT INTO "verbs" ("portuguese", "infinitive", "past_simple", "past_participle", "list") VALUES ($1, $2, $3, $4, $5)`,
        [verb.portuguese, verb.infinitive, verb.past_simple, verb.past_participle, verb.list]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "verbs"`);
    await queryRunner.dropColumn("verbs", "list");
  }
}
