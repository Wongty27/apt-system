import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import {
  Hospital,
  PageOptionsDto,
  PaginatedDto,
  RequestWithUser,
} from 'src/common';
import { DB } from 'src/database/database';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { CreateStaffDto } from './dtos';

@Injectable()
export class StaffsService {
  constructor(
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}

  async getProfile(req: RequestWithUser): Promise<any> {
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
        SELECT * FROM ${schemaName}.staffs
        WHERE id = ${req.user.sub}
      `;
      return await query.execute(this.db);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createStaff(
    req: RequestWithUser,
    createStaffDto: CreateStaffDto,
  ): Promise<any> {
    try {
      console.log(req);
      const query = sql`
      SELECT *
      FROM ${req.user.hospital}.staffs
      WHERE email = ${createStaffDto.email}
      `;
      const existingStaff = await query.execute(this.db);

      if (existingStaff) {
        throw new ConflictException('Staff already exists');
      }

      const insertQuery = sql`
      INSERT INTO ${req.user.hospital}.staffs
      (email, username, password, role)
      VALUES
      (${createStaffDto.email}, ${createStaffDto.username}, ${createStaffDto.password}, ${createStaffDto.role})
      RETURNING *
      `;
      return await insertQuery.execute(this.db);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async getStaffList(pageOptionsDto: PageOptionsDto): Promise<PaginatedDto<any>> {}

  async getStaffByEmail(email: string): Promise<any> {
    try {
      // switch (req.)
      // return await this.db.selectFrom('s')
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async updateStaff(id: number): Promise<void> {
  //   try {
  //     const result = await this.db
  //       .updateTable('staffs')
  //       .set()
  //       .where('id', '=', id)
  //       .execute();
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  // async deleteStaff(id: number): Promise<void> {
  //   try {
  //     await this.db.deleteFrom('staffs').where('id', '=', id).execute();
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }
}
