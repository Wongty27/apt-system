import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DB } from 'src/database/database';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { CreateHospitalDto } from './dto';
import { Hospital, RequestWithUser } from 'src/common';

@Injectable()
export class HospitalsService {
  constructor(
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}

  async createHospital(
    req: RequestWithUser,
    createHospitalDto: CreateHospitalDto,
  ) {
    try {
      const schemaName = req.user.hospital;

      await this.db
        .insertInto(`${schemaName}.hospitals`)
        .values(createHospitalDto)
        .execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
