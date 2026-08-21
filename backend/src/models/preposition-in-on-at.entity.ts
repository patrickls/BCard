import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "preposition_in_on_at" })
export class PrepositionInOnAtEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 500 })
  sentence!: string;

  @Column({ type: "varchar", length: 10 })
  answer!: string;

  @Column({ name: "group_number", type: "smallint" })
  groupNumber!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
