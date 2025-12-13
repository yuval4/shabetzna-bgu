import { OneToOne, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { User } from './user.entity';
import { stringToNumberTransformer } from '../../../utils/transformers/string-to-number.transformer';

@ViewEntity('points', { synchronize: true })
export class Points {
  @OneToOne(() => User)
  @PrimaryColumn()
  userId: string;

  @ViewColumn({ transformer: stringToNumberTransformer })
  weekday: number;

  @ViewColumn({ transformer: stringToNumberTransformer })
  thursday: number;

  @ViewColumn({ transformer: stringToNumberTransformer })
  friday: number;

  @ViewColumn({ transformer: stringToNumberTransformer })
  saturday: number;

  @ViewColumn({ transformer: stringToNumberTransformer })
  readiness: number;

  @ViewColumn({ transformer: stringToNumberTransformer })
  total: number;
}
