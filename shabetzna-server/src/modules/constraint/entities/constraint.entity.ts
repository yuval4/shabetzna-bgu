import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mission } from '../../missions/entities/mission.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'constraints', synchronize: true })
export class Constraint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user: User;

  @Column({ type: 'uuid' })
  userId: User['id'];

  @ManyToOne(() => Mission)
  @JoinColumn([
    {
      name: 'mission_id',
      referencedColumnName: 'id',
    },
  ])
  mission: Mission;

  @Column({ type: 'uuid' })
  missionId: Mission['id'];

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 20 })
  type: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text' })
  status: string;

  @Column()
  shiftType: string;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', select: false })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'created_by',
      referencedColumnName: 'id',
    },
  ])
  createdBy: User;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'updated_by',
      referencedColumnName: 'id',
    },
  ])
  updatedBy: User;
}
