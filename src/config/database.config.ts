import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT as string) || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  name: process.env.PG_DB,
}));
