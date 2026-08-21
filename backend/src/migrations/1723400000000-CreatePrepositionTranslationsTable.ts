import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePrepositionTranslationsTable1723400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "preposition_translations",
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
            name: "answers",
            type: "text",
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

    const translationsData = [
      { portuguese: "Em", answers: "in,on,at" },
      { portuguese: "De, a partir de", answers: "of,from" },
      { portuguese: "Para, a", answers: "to" },
      { portuguese: "Para, por", answers: "for" },
      { portuguese: "Por", answers: "by" },
      { portuguese: "Sobre", answers: "about" },
      { portuguese: "Com", answers: "with" },
      { portuguese: "Sem", answers: "without" },
      { portuguese: "Como", answers: "like" },
    ];

    for (const row of translationsData) {
      await queryRunner.query(
        `INSERT INTO "preposition_translations" ("portuguese", "answers") VALUES ($1, $2)`,
        [row.portuguese, row.answers]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("preposition_translations");
  }
}
