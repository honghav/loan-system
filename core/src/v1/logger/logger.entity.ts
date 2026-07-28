// audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  method!: string; // GET, POST, PUT, DELETE

  @Column()
  url!: string; // /api/users

  @Column()
  statusCode!: number; // 200, 201, 500

  @Column()
  durationMs!: number; // Execution time in ms

  @Column({ type: 'jsonb', nullable: true })
  requestBody!: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  responseBody!: Record<string, any>;

  @Column({ type: 'jsonb', default: [] })
  sqlQueries!: { sql: string; parameters?: any[]; duration?: number }[];

  @CreateDateColumn()
  createdAt!: Date;
}
