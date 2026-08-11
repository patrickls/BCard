import { MigrationInterface, QueryRunner } from "typeorm";

// Corrige de forma definitiva (não-relativa) a coluna "list", pois a migration
// anterior (FixVerbsListLabels) partiu de uma premissa errada sobre o estado
// atual dos dados e zerou a distinção entre as duas listas.
export class SetVerbsListByInfinitive1723390200000 implements MigrationInterface {
  private lista2Infinitives = [
    "hide", "hit", "hold", "hurt", "keep", "kneel", "know", "lay", "lead", "leap",
    "learn", "leave", "lend", "let", "lie", "light", "lose", "make", "mean", "meet",
    "pay", "put", "quit", "read", "ride", "ring", "rise", "run", "say", "see",
    "seek", "sell", "send", "set", "shake", "shed", "shine", "shoot", "show", "shred",
    "shrink", "shut", "sing", "sink", "sit", "sleep",
  ];

  private lista1Infinitives = [
    "be", "have", "bear", "beat", "become", "begin", "bend", "bet", "bite", "bleed",
    "blow", "break", "bring", "build", "burn", "burst", "buy", "cast", "catch", "choose",
    "come", "cost", "creep", "cut", "deal", "dig", "do", "draw", "drink", "drive",
    "eat", "fall", "feed", "feel", "fight", "find", "flee", "fly", "forget", "forgive",
    "freeze", "get", "give", "go", "grow", "hang", "hear",
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "verbs" SET "list" = 'Lista 1' WHERE "infinitive" = ANY($1)`,
      [this.lista1Infinitives]
    );
    await queryRunner.query(
      `UPDATE "verbs" SET "list" = 'Lista 2' WHERE "infinitive" = ANY($1)`,
      [this.lista2Infinitives]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Não reversível de forma segura (a migration anterior a esta já era destrutiva).
  }
}
