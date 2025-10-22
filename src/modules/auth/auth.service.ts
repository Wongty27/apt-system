import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { Hospital, HospitalDomain, StaffRole, UserRole } from 'src/common';
import { AuthenticatedUser } from './interfaces';
import { Kysely, sql } from 'kysely';
import { DB } from 'src/database/database';
import { UserDto } from '../staffs/dtos';
import * as crypto from 'crypto';
import { KYSELY_TOKEN } from 'src/database/database.module';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly hospitals: string[] = Object.values(Hospital);
  private readonly accessTokenExpiry = process.env.JWT_EXPIRES_IN || '1h';
  private readonly refreshTokenExpirySeconds = Number(
    process.env.REFRESH_TOKEN_EXPIRES_SECONDS || 60 * 60 * 24 * 30,
  );

  private readonly refreshTokenHashRounds = Number(
    process.env.REFRESH_HASH_ROUNDS || 10,
  );

  constructor(
    private jwtService: JwtService,
    @Inject(KYSELY_TOKEN)
    private db: Kysely<DB>,
  ) {}

  private resolveHospitalFromStaffEmail(email: string): string | null {
    const lowerEmail = email.toLowerCase();
    for (const key of Object.keys(HospitalDomain)) {
      const domain =
        HospitalDomain[key as keyof typeof HospitalDomain].toLowerCase();

      if (lowerEmail.endsWith(domain)) {
        return key.toLowerCase();
      }
    }
    return null;
  }

  private async findsuperAdminByEmail(
    email: string,
  ): Promise<UserDto | undefined> {
    return await this.db
      .selectFrom('auth.super_admins' as any)
      .select(['id', 'email', 'password', 'role'])
      .where('is_active', '=', true)
      .where('email', '=', email)
      .executeTakeFirst();
  }

  private async findStaffByEmail(
    email: string,
    hospital: string,
  ): Promise<UserDto | undefined> {
    const tableName = `${hospital}.staffs`;
    return await this.db
      .selectFrom(tableName as any)
      .select(['id', 'email', 'password', 'role'])
      .where('email', '=', email)
      .executeTakeFirst();
  }

  private async findPatientByEmail(
    email: string,
    hospital: string,
  ): Promise<UserDto | undefined> {
    const tableName = `${hospital}.patients`;
    return await this.db
      .selectFrom(tableName as any)
      .select(['id', 'email', 'password', 'role'])
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async validateUser(loginDto: LoginDto): Promise<AuthenticatedUser> {
    // validate super admin
    const superAdmin = await this.findsuperAdminByEmail(loginDto.email);

    if (superAdmin) {
      const passwordMatches = await bcrypt.compare(
        loginDto.password,
        superAdmin.password,
      );

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        sub: superAdmin.id,
        email: superAdmin.email,
        hospital: '',
        userType: UserRole.Staff,
        role: superAdmin.role as StaffRole,
      };
    }
    const resolvedHospital = this.resolveHospitalFromStaffEmail(loginDto.email);
    if (resolvedHospital) {
      // validate staffs
      const staff = await this.findStaffByEmail(
        loginDto.email,
        resolvedHospital,
      );

      if (!staff) {
        throw new UnauthorizedException('User not found');
      }

      const passwordMatches = await bcrypt.compare(
        loginDto.password,
        staff.password,
      );

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        sub: staff.id,
        email: staff.email,
        hospital: resolvedHospital,
        userType: UserRole.Staff,
        role: staff.role as StaffRole,
      };
    }

    // validate customers
    for (const hospital of this.hospitals) {
      const patient = await this.findPatientByEmail(loginDto.email, hospital);
      if (!patient) continue;

      const passwordMatched = await bcrypt.compare(
        loginDto.password,
        patient.password,
      );
      if (!passwordMatched) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        sub: patient.id,
        email: patient.email,
        hospital: hospital,
        userType: UserRole.Patient,
        role: null,
      };
    }

    throw new UnauthorizedException('User not found');
  }

  private generateOpaqueToken(): string {
    return crypto.randomBytes(48).toString('hex');
  }

  private async hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, this.refreshTokenHashRounds);
  }

  private async generateAccessToken(user: AuthenticatedUser) {
    return await this.jwtService.signAsync(user);
  }

  private async storeRefreshToken(
    user: AuthenticatedUser,
    refreshToken: string,
  ) {
    const hash = await this.hashRefreshToken(refreshToken);
    const expiresAt = new Date(
      Date.now() + this.refreshTokenExpirySeconds * 1000,
    );
    await this.db
      .insertInto('refresh_tokens')
      .values({
        user_id: user.sub,
        hospital: user.hospital,
        token_hash: hash,
        is_revoked: false,
        expires_at: expiresAt.toUTCString(),
      })
      .execute();
  }

  private async revokeRefreshTokenById(id: any) {
    try {
      await this.db
        .updateTable('refresh_tokens')
        .set({ is_revoked: true })
        .where('id', '=', id)
        .execute();
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async findRefreshTokenRowByToken(refreshToken: string) {
    const rows = await this.db
      .selectFrom('refresh_tokens')
      .selectAll()
      .where('is_revoked', '=', false)
      .where(sql`expires_at > now()` as any)
      .execute();

    for (const r of rows) {
      if (await bcrypt.compare(refreshToken, r.token_hash)) {
        return r;
      }
    }
    return null;
  }

  async loginWithRefresh(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const payload = {
      sub: user.sub,
      email: user.email,
      hospital: user.hospital,
      userType: user.userType,
      role: user.role,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = this.generateOpaqueToken();
    await this.storeRefreshToken(payload, refreshToken);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: this.accessTokenExpiry,
    };
  }

  async login(user: AuthenticatedUser) {
    return await this.jwtService.signAsync(user);
  }

  async logout(refreshToken: string) {
    const row = await this.findRefreshTokenRowByToken(refreshToken);
    if (!row) return false;
    await this.revokeRefreshTokenById(row.id);
    return true;
  }
}
