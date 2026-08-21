import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePrepositionToForTable1723400200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "preposition_to_for",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "sentence_pt",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "answer_en",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "group_number",
            type: "smallint",
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

    const toForData = [
      // Grupo 1 — regra "to vs. for"
      { sentencePt: "Eu dei um presente para o Fernando.", answerEn: "I gave a present to Fernando.", groupNumber: 1 },
      { sentencePt: "Eu dei um presente ao Patrick.", answerEn: "I gave a present to Patrick.", groupNumber: 1 },
      { sentencePt: "Eu vou para Miami.", answerEn: "I'm going to Miami.", groupNumber: 1 },
      { sentencePt: "Eu vou a New York.", answerEn: "I'm going to New York.", groupNumber: 1 },
      { sentencePt: "Eu comprei um carro para você.", answerEn: "I bought a car for you.", groupNumber: 1 },
      { sentencePt: "Eu fiz um bolo para você.", answerEn: "I made a cake for you.", groupNumber: 1 },
      { sentencePt: "Ela está procurando por um emprego.", answerEn: "She is looking for a job.", groupNumber: 1 },
      { sentencePt: "Nós estudamos para a prova.", answerEn: "We studied for the test.", groupNumber: 1 },
      // Grupo 2 — regra "presença de objeto"
      { sentencePt: "Eu estou esperando o ônibus.", answerEn: "I'm waiting for the bus.", groupNumber: 2 },
      { sentencePt: "Eu estou esperando.", answerEn: "I'm waiting.", groupNumber: 2 },
      { sentencePt: "Eu estou ouvindo você.", answerEn: "I'm listening to you.", groupNumber: 2 },
      { sentencePt: "Eu estou ouvindo.", answerEn: "I'm listening.", groupNumber: 2 },
    ];

    for (const row of toForData) {
      await queryRunner.query(
        `INSERT INTO "preposition_to_for" ("sentence_pt", "answer_en", "group_number") VALUES ($1, $2, $3)`,
        [row.sentencePt, row.answerEn, row.groupNumber]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("preposition_to_for");
  }
}
