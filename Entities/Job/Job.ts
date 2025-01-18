import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Application } from 'Entities/Application/Application';
import { User } from 'Entities/User/User';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datePosted: Date;

  @Column('text')
  description: string;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @ManyToOne(() => User, (user) => user.id)
  admin: User; // Admin who created this job
}
