import { Hospital } from '../enums/hospital.enum';
import { UserRole } from '../enums/user-role.enum';

export class JwtPayloadDto {
  sub: number;
  email: string;
  hospital: Hospital;
  userType: UserRole;
  role: string;
  app: string;
  datetime: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}
