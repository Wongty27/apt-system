import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReqPayload } from './interfaces';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    // find user by email
    const user = await this.usersService.getUser(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(`User: ${user}`);

    // compared hashed password
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user[0].password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: ReqPayload = {
      sub: user[0].id,
      email: user[0].email,
      username: user[0].username,
      role: user[0].role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async logout() {}
}
