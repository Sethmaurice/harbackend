import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'Entities/User/User';
import { Job } from 'Entities/Job/Job';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateApplied: Date;

  @Column({ default: 'Pending' })
  status: string; // Pending, Reviewed, Accepted
}
