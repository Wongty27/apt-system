import { UserRole } from 'src/database/database';

export class UserDto {
  id: number;
  email: string;
  password: string;
  username: string;
  role: UserRole[];
}
