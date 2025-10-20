import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { JwtPayload, ReqPayload } from './interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
      ignoreExpiration: false,
      issuer: 'apms.com',
      audience: 'apms-app',
    });
  }

  async validate(payload: JwtPayload): Promise<ReqPayload | null> {
    const user = await this.usersService.getUser(payload.username);

    if (!user) {
      throw new UnauthorizedException('User o found');
    }

    return {
      sub: user[0].id,
      email: user[0].email,
      username: user[0].username,
      role: user[0].role,
    };
  }
}
