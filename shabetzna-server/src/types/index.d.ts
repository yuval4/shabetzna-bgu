import { User } from '../modules/users/entities/user.entity';

export {};

export type UserMetadata = Pick<User, 'id'>;

declare global {
  namespace Express {
    interface User extends UserMetadata {}
  }
}
