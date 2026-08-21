import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "preposition_to_for" })
export class PrepositionToForEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "sentence_pt", type: "varchar", length: 500 })
  sentencePt!: string;

  @Column({ name: "answer_en", type: "varchar", length: 500 })
  answerEn!: string;

  @Column({ name: "group_number", type: "smallint" })
  groupNumber!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
