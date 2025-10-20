import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { PageOptionsDto } from 'src/common';
import { DB } from 'src/database/database';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { CreateStaffDto } from './dtos';

@Injectable()
export class StaffsService {
  constructor(
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}

  async createStaff(createStaffDto: CreateStaffDto): Promise<any> {
    try {
      const existingStaff = await this.db
        .selectFrom('staffs')
        .select('email')
        .where('')
        .or('email', '=', createStaffDto.email)
        .execute();

      if (existingStaff) {
        throw new ConflictException('Staff already exists');
      }
      const staff = await this.db
        .insertInto('staffs')
        .values(createStaffDto)
        .execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getStaffList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginatedDto<any>> {}

  async getStaffById(id: number): Promise<any> {}

  async updateStaff(id: number): Promise<void> {}

  async deleteStaff(id: number): Promise<void> {}
}
