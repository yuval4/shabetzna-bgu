import { User } from 'src/modules/users/entities/user.entity';

export class LoginDto extends User {
  id: User['id'];
  username: User['username'];
}
