import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserRole } from 'src/common';

export class CreateStaffDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Min(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(15)
  username: string;

  @IsEnum(UserRole)
  @IsArray()
  @IsNotEmpty()
  role: UserRole[];
}
