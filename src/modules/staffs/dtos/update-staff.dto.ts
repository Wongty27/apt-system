import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserRole } from 'src/common';

export class UpdateStaffDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Min(8, { message: 'Password must be at least 8 characters' })
  password?: string;

  @IsString()
  @IsOptional()
  @Max(15)
  @Min(3)
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  roles?: UserRole[];
}
