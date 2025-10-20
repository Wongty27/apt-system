import { UserRole } from 'src/database/database';

export class ReqPayload {
  sub: number;
  email: string;
  username: string;
  role: UserRole[];
}
