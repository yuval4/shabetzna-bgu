import { UserToMission } from 'src/modules/missions/entities/user-mission.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Constraint } from '../../constraint/entities/constraint.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { UserToTeam } from '../../teams/entities/user-team.entity';
import { Points } from './points.entity';

@Entity({ name: 'users', synchronize: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  username: string;

  @Column()
  email: string;

  @Column({ length: 10 })
  phone: string;

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

  @OneToMany(() => UserToTeam, (userToTeam) => userToTeam.user)
  teams: UserToTeam[];

  @OneToMany(() => UserToMission, (userToMission) => userToMission.user)
  missions: UserToMission[];

  @OneToMany(() => Shift, (shift) => shift.assignedUser)
  @JoinTable({
    name: 'shifts',
    joinColumn: { name: 'assigned_user', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id' },
  })
  shifts: Shift[];

  @OneToMany(() => Constraint, (constraint) => constraint.user)
  @JoinTable({
    name: 'constraint',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id' },
  })
  constraints: Constraint[];

  @OneToOne(() => Points)
  @JoinColumn({ name: 'id' })
  points: Points;
}
