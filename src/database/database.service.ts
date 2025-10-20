import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  createInstance() {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }),
    });

    return new Kysely({
      dialect: dialect,
      plugins: [new CamelCasePlugin()],
      log: ['error'],
    });
  }
}
