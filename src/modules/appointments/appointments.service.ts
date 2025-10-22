import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'src/database/database';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { CreateAptDto } from './dtos/create-apt.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}

  async create(createAptDto: CreateAptDto) {
    try {
      const schemaName = createAptDto.hospitalName;
      await this.db
        .insertInto(`${schemaName}.appointments` as any)
        .values({
          patient_id: createAptDto.patientId,
          doctor_id: createAptDto.doctorId,
          hospital_id: createAptDto.hospitalName,
          message: createAptDto.message,
          apmt_time: createAptDto.apmtTime,
        })
        .execute();
    } catch (error) {
      console.error(error);
    }
  }
}
