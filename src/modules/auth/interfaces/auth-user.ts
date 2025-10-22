import { StaffRole, UserRole } from 'src/common';

export class AuthenticatedUser {
  sub: number;
  email: string;
  hospital: string;
  userType: UserRole;
  role: StaffRole | null;
}
