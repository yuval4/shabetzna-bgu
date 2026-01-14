import { Team } from '../../teams/entities/team.entity';
import { User } from '../../users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ShiftType {
  FULL_DAY = 'FULL_DAY',
  DAY = 'DAY',
  NIGHT = 'NIGHT',
}

@Entity({ name: 'shifts', synchronize: true })
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  teamId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  comment: string;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.FULL_DAY,
  })
  shiftType: ShiftType;

  @ManyToOne(() => User)
  @JoinColumn([
    {
      name: 'assigned_user',
      referencedColumnName: 'id',
    },
  ])
  assignedUser: User;

  @Column({ type: 'uuid', name: 'assigned_user' })
  assignedUserId: User['id'];

  @Column({ default: false, comment: 'the user is the only one in the base' })
  isVacation: boolean;

  @Column({ default: false })
  isHoliday: boolean;

  @Column({ default: true })
  hasAfter: boolean;

  @Column({ default: false })
  isReadiness: boolean;

  @Column({ type: 'numeric', default: 0 })
  bonus: number;

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

  @ManyToOne(() => Team, (team) => team.id)
  team: Team;

  @BeforeInsert()
  setShiftFlags() {
    const shiftDate = new Date(this.date);
    const isVacationOnTheSystem = false;

    // if thursday or friday, and if phisical shift
    // 0.25 points
    if (!this?.isHoliday) {
      this.isHoliday = !this.isReadiness && isVacationOnTheSystem;
    }

    // if the user is the only one in the base (suterday, friday, or holiday). and if phisical shift. search for holidays api.
    // 1 points
    if (!this?.isVacation) {
      this.isVacation =
        !this.isReadiness &&
        (isVacationOnTheSystem ||
          shiftDate.getDay() === 5 ||
          shiftDate.getDay() === 6);
    }

    // if not readiness, and not friday or thursday
    // 0.5 points
    if (!this?.hasAfter) {
      this.hasAfter =
        !this.isReadiness &&
        shiftDate.getDay() !== 4 &&
        shiftDate.getDay() !== 5;
    }

    return this;
  }
}
