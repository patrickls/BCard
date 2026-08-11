import { MigrationInterface, QueryRunner } from "typeorm";

export class FixVerbsListLabels1723390100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "verbs"
      SET "list" = CASE
        WHEN "list" = 'Lista 1' THEN 'Lista 2'
        WHEN "list" = 'Lista 2' THEN 'Lista 1'
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "verbs"
      SET "list" = CASE
        WHEN "list" = 'Lista 1' THEN 'Lista 2'
        WHEN "list" = 'Lista 2' THEN 'Lista 1'
      END
    `);
  }
}
