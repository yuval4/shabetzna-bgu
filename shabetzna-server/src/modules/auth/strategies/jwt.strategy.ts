import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { Injectable } from '@nestjs/common';

export const TOKEN_KEY = 'user_token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  private static extractJWT(req: RequestType): string | null {
    // auth with cookies
    if (
      req.cookies &&
      TOKEN_KEY in req.cookies &&
      req.cookies[TOKEN_KEY].length > 0
    ) {
      return req.cookies[TOKEN_KEY];
    }

    // auth with headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      return req.headers.authorization.substring(7);
    }

    return null;
  }

  // set here type or Request?
  async validate(payload: any) {
    return { id: payload.id };
  }
}
