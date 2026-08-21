import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePrepositionInOnAtTable1723400300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "preposition_in_on_at",
        columns: [
          { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
          { name: "sentence", type: "varchar", length: "500", isNullable: false },
          { name: "answer", type: "varchar", length: "10", isNullable: false },
          { name: "group_number", type: "smallint", isNullable: false },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      }),
      true
    );

    const inOnAtData = [
      // Grupo 1 — local da cidade
      { sentence: "I am ___ the bus station", answer: "at", groupNumber: 1 },
      { sentence: "I am ___ home", answer: "at", groupNumber: 1 },
      { sentence: "I am ___ the square", answer: "at", groupNumber: 1 },
      // Grupo 2 — Time, Moment, Instant
      { sentence: "I'm busy ___ the moment", answer: "at", groupNumber: 2 },
      { sentence: "She arrived ___ the right time", answer: "at", groupNumber: 2 },
      // Grupo 3 — ideia de proximidade
      { sentence: "He is ___ the door", answer: "at", groupNumber: 3 },
      { sentence: "He is ___ the window", answer: "at", groupNumber: 3 },
      // Grupo 4 — bom ou ruim em algo
      { sentence: "I'm good ___ soccer", answer: "at", groupNumber: 4 },
      { sentence: "I'm suck ___ volleyball", answer: "at", groupNumber: 4 },
      // Grupo 5 — meios de transporte (exceção: carro usa IN)
      { sentence: "I'm ___ the bus.", answer: "on", groupNumber: 5 },
      { sentence: "I'm ___ the train.", answer: "on", groupNumber: 5 },
      // Grupo 6 — dias
      { sentence: "___ sunday", answer: "on", groupNumber: 6 },
      { sentence: "___ the weekend", answer: "on", groupNumber: 6 },
      // Grupo 7 — sobre, em cima
      { sentence: "The book is ___ the table", answer: "on", groupNumber: 7 },
      { sentence: "The box is ___ the floor", answer: "on", groupNumber: 7 },
      // Grupo 8 — elétrico/eletrônico
      { sentence: "Turn ___ your phone", answer: "on", groupNumber: 8 },
      { sentence: "___ the internet", answer: "on", groupNumber: 8 },
      { sentence: "I am ___ Instagram.", answer: "on", groupNumber: 8 },
      { sentence: "Turn ___ the radio", answer: "on", groupNumber: 8 },
      // Grupo 9 — wildcard, significa dentro
      { sentence: "I am ___ love", answer: "in", groupNumber: 9 },
      { sentence: "It is ___ the box", answer: "in", groupNumber: 9 },
      { sentence: "Stay ___ bed", answer: "in", groupNumber: 9 },
    ];

    for (const row of inOnAtData) {
      await queryRunner.query(
        `INSERT INTO "preposition_in_on_at" ("sentence", "answer", "group_number") VALUES ($1, $2, $3)`,
        [row.sentence, row.answer, row.groupNumber]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("preposition_in_on_at");
  }
}
