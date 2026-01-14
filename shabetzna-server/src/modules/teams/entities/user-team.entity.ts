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
import { Team } from './team.entity';
import { User } from '../../users/entities/user.entity';

@Entity('user_to_team', { synchronize: true })
export class UserToTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  role: string;

  @Column({ type: Boolean })
  isActiveShifts: boolean;

  @Column({ type: 'uuid' })
  userId;

  @Column({ type: 'uuid' })
  teamId;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, (team) => team.users)
  @JoinColumn({ name: 'team_id' })
  team: Team;

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
