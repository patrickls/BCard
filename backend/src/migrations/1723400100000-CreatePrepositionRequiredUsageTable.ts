import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePrepositionRequiredUsageTable1723400100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "preposition_required_usage",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "word",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "answer",
            type: "varchar",
            length: "50",
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

    const requiredUsageData = [
      { word: "Good", answer: "at" },
      { word: "Interested", answer: "in" },
      { word: "Sorry", answer: "for" },
      { word: "Thank", answer: "for" },
    ];

    for (const row of requiredUsageData) {
      await queryRunner.query(
        `INSERT INTO "preposition_required_usage" ("word", "answer") VALUES ($1, $2)`,
        [row.word, row.answer]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("preposition_required_usage");
  }
}
