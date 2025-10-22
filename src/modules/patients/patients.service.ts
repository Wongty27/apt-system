import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DB } from 'src/database/database';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { Hospital, RequestWithUser } from 'src/common';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}
  async getPatientByEmail(req: RequestWithUser): Promise<any> {
    let schemaName = '';
    try {
      // choose schema based on user req
      switch (req.user.hospital) {
        case Hospital.kpj:
          schemaName = Hospital.kpj;
          break;

        case Hospital.smc:
          schemaName = Hospital.smc;
          break;
      }

      const query = sql`
        SELECT * FROM ${schemaName}.patients
        WHERE id = ${req.user.sub}
      `;
      return await query.execute(this.db);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
