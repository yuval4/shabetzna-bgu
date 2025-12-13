import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    console.log('function: validate ---> ', 'Google profile:', profile);
    console.log(
      'function: validate ---> ',
      'Email:',
      profile.emails?.[0]?.value,
    );

    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      username: profile.name.givenName,
    });

    return user;
  }
}
