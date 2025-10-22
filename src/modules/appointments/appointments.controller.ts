import { Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles, StaffRole } from 'src/common';
import { AppointmentsService } from './appointments.service';
import { CreateAptDto } from './dtos/create-apt.dto';

@ApiBearerAuth('access-token')
@Controller('appointments')
@Roles(StaffRole.Admin, StaffRole.SuperAdmin)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Query() createAptDto: CreateAptDto) {
    await this.appointmentsService.create(createAptDto);
  }
}
