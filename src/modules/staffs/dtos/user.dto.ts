import { StaffRole } from 'src/database/database';

export class UserDto {
  id: number;
  email: string;
  password: string;
  role: StaffRole | null;
}
