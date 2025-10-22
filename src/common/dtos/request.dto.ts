import { JwtPayloadDto } from './jwt-payload';

export class RequestWithUser extends Request {
  user: JwtPayloadDto;
}
