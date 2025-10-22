import { StaffRole } from 'src/common';

export class GetStaffDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: StaffRole;
}
