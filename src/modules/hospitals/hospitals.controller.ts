import { Body, Controller, Post, Query, Req } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto';
import { RequestWithUser, Roles, StaffRole } from 'src/common';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Roles(StaffRole.SuperAdmin)
  @Post()
  async createHospital(
    @Req() req: RequestWithUser,
    @Query() createHospitalDto: CreateHospitalDto,
  ) {
    await this.hospitalsService.createHospital(req, createHospitalDto);
  }
}
