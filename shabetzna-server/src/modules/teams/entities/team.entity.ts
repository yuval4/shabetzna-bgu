import { Unit } from 'src/modules/units/entities/unit.entity';
import { User } from 'src/modules/users/entities/user.entity';
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
import { UserToTeam } from './user-team.entity';

@Entity({ name: 'teams', synchronize: true })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, select: true })
  name: string;

  @Column({ length: 10, select: true })
  phone: string;

  @Column()
  description: string;

  @Column()
  unitId: string;

  @ManyToOne(() => Unit)
  unit: Unit;

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

  @OneToMany(() => UserToTeam, (userToTeam) => userToTeam.team)
  users: UserToTeam[];
}
