import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'units', synchronize: true })
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, select: true })
  name: string;
}
