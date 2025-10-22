import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, RequestWithUser } from 'src/common';
import { LoginDto } from './dtos';
import { Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {
  private readonly refreshCookieName = 'refresh_token';

  constructor(private authService: AuthService) {}

  private setRefreshCookie(
    res: Response,
    token: string,
    maxAgeSeconds: number,
  ) {
    const cookieOpts = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      maxAge: maxAgeSeconds * 1000,
      path: '/',
    };
    res.cookie(this.refreshCookieName, token, cookieOpts);
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(this.refreshCookieName, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      path: '/',
    });
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const result = await this.authService.loginWithRefresh(loginDto);

    const refreshExpirySec = Number(
      process.env.REFRESH_TOKEN_EXPIRES_SECONDS || 60 * 60 * 24 * 30,
    );
    this.setRefreshCookie(res, result.refreshToken, refreshExpirySec);
    return {
      accessToken: result.accessToken,
      expiresAt: result.expiresAt,
    };
  }

  @Post('refresh')
  async refressh(@Req() req: RequestWithUser, @Res() res: Response) {}
}
