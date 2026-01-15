import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserToMission } from './user-mission.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity({ name: 'missions', synchronize: true })
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, select: true })
  name: string;

  @Column()
  description: string;

  @Column()
  teamId: string;

  @ManyToOne(() => Team)
  team: Team;

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

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', select: false })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'updated_by',
      referencedColumnName: 'id',
    },
  ])
  updatedBy: User;

  @OneToMany(() => UserToMission, (userToMission) => userToMission.mission)
  users: UserToMission[];
}
