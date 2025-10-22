import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { AuthenticatedUser } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
      ignoreExpiration: false,
      issuer: 'apms.com',
      audience: 'apms-app',
    });
  }

  validate(payload: AuthenticatedUser): AuthenticatedUser | null {
    return {
      sub: payload.sub,
      email: payload.email,
      hospital: payload.hospital,
      userType: payload.userType,
      role: payload.role,
    };
  }
}
