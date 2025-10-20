export class JwtPayload {
  sub: number;
  username: string;
  email: string;
  role: string;
  app: string;
  datetime: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}
