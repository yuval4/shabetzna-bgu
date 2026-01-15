import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { Mission } from './mission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('user_to_mission', { synchronize: true })
export class UserToMission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  role: string;

  @Column({ type: 'uuid' })
  userId;

  @Column({ type: 'uuid' })
  missionId: string;

  @Column({ type: Boolean })
  isActiveShifts: boolean;

  @ManyToOne(() => User, (user) => user.missions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Mission, (mission) => mission.users)
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', select: false })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'created_by',
      referencedColumnName: 'id',
    },
  ])
  createdBy: User;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', select: false })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'updated_by',
      referencedColumnName: 'id',
    },
  ])
  updatedBy: User;

  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_at',
    nullable: true,
    select: false,
  })
  deletedAt: Date;
}
