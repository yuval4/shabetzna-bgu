import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userId: User['id']): Promise<string> {
    try {
      console.log('function: signIn ---> ', 'Signing in user:', userId);

      const user = await this.usersService.findOne(userId);
      const payload = { id: user.id };
      const token = await this.jwtService.sign(payload);

      console.log('function: signIn ---> ', 'Generated token:', token);

      return token;
    } catch (error) {
      console.error('function: signIn ---> ', 'Sign in error:', error);

      throw new UnauthorizedException();
    }
  }

  async validateGoogleUser(googleUser: CreateUserDto): Promise<User> {
    console.log(
      'function: validateGoogleUser ---> ',
      'Validating user with email:',
      googleUser.email,
    );

    const user = await this.usersService.findOneByEmail(googleUser.email);

    if (!user) {
      console.warn(
        'function: validateGoogleUser ---> ',
        'No user found for email:',
        googleUser.email,
      );
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
