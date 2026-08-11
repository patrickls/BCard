import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "verbs" })
export class VerbEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  portuguese!: string;

  @Column({ type: "varchar", length: 255 })
  infinitive!: string;

  @Column({ name: "past_simple", type: "varchar", length: 255 })
  pastSimple!: string;

  @Column({ name: "past_participle", type: "varchar", length: 255 })
  pastParticiple!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
