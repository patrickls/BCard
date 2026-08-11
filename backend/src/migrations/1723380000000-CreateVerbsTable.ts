import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVerbsTable1723380000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "verbs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "portuguese",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "infinitive",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "past_simple",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "past_participle",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    const verbsData = [
      { portuguese: "Ir", infinitive: "go", past_simple: "went", past_participle: "gone" },
      { portuguese: "Vir", infinitive: "come", past_simple: "came", past_participle: "come" },
      { portuguese: "Fazer", infinitive: "do", past_simple: "did", past_participle: "done" },
      { portuguese: "Ter", infinitive: "have", past_simple: "had", past_participle: "had" },
      { portuguese: "Ver", infinitive: "see", past_simple: "saw", past_participle: "seen" },
      { portuguese: "Correr", infinitive: "run", past_simple: "ran", past_participle: "run" },
      { portuguese: "Escrever", infinitive: "write", past_simple: "wrote", past_participle: "written" },
      { portuguese: "Ler", infinitive: "read", past_simple: "read", past_participle: "read" },
      { portuguese: "Pegar / Tomar", infinitive: "take", past_simple: "took", past_participle: "taken" },
      { portuguese: "Dar", infinitive: "give", past_simple: "gave", past_participle: "given" },
      { portuguese: "Comer", infinitive: "eat", past_simple: "ate", past_participle: "eaten" },
      { portuguese: "Beber", infinitive: "drink", past_simple: "drank", past_participle: "drunk" },
      { portuguese: "Falar", infinitive: "speak", past_simple: "spoke", past_participle: "spoken" },
      { portuguese: "Comprar", infinitive: "buy", past_simple: "bought", past_participle: "bought" },
      { portuguese: "Vender", infinitive: "sell", past_simple: "sold", past_participle: "sold" },
      { portuguese: "Pensar", infinitive: "think", past_simple: "thought", past_participle: "thought" },
      { portuguese: "Encontrar", infinitive: "find", past_simple: "found", past_participle: "found" },
      { portuguese: "Quebrar", infinitive: "break", past_simple: "broke", past_participle: "broken" },
      { portuguese: "Construir", infinitive: "build", past_simple: "built", past_participle: "built" },
      { portuguese: "Trazer", infinitive: "bring", past_simple: "brought", past_participle: "brought" },
      { portuguese: "Escolher", infinitive: "choose", past_simple: "chose", past_participle: "chosen" },
      { portuguese: "Voar", infinitive: "fly", past_simple: "flew", past_participle: "flown" },
      { portuguese: "Esquecer", infinitive: "forget", past_simple: "forgot", past_participle: "forgotten" },
      { portuguese: "Conhecer / Encontrar", infinitive: "meet", past_simple: "met", past_participle: "met" },
      { portuguese: "Pagar", infinitive: "pay", past_simple: "paid", past_participle: "paid" },
      { portuguese: "Enviar", infinitive: "send", past_simple: "sent", past_participle: "sent" },
      { portuguese: "Nadar", infinitive: "swim", past_simple: "swam", past_participle: "swum" },
      { portuguese: "Ensinar", infinitive: "teach", past_simple: "taught", past_participle: "taught" },
      { portuguese: "Entender", infinitive: "understand", past_simple: "understood", past_participle: "understood" },
      { portuguese: "Dizer", infinitive: "say", past_simple: "said", past_participle: "said" },
    ];

    for (const verb of verbsData) {
      await queryRunner.query(
        `INSERT INTO "verbs" ("portuguese", "infinitive", "past_simple", "past_participle") VALUES ($1, $2, $3, $4)`,
        [verb.portuguese, verb.infinitive, verb.past_simple, verb.past_participle]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("verbs");
  }
}
