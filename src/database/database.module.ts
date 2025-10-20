import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

export const KYSELY_TOKEN = 'KYSELY_CONNECTION';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: KYSELY_TOKEN,
      useFactory: (databaseService: DatabaseService) =>
        databaseService.createInstance(),
      inject: [DatabaseService],
    },
  ],
  exports: [KYSELY_TOKEN],
})
export class DatabaseModule {}
