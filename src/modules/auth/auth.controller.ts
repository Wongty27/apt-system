import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common';
import { LoginDto } from './dtos';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Query() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(loginDto);
  }
}
