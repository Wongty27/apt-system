import { Controller, Delete, Get, Post } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { PaginatedDto, Roles, UserRole } from 'src/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateStaffDto } from './dtos';

@Controller('staffs')
// @ApiBearerAuth()
// @Roles(UserRole.SuperAdmin, UserRole.Admin)
export class StaffsController {
  constructor(private staffsService: StaffsService) {}

  @Post()
  async createStaff(createStaffDto: CreateStaffDto): Promise<any> {
    return await this.staffsService.createStaff(createStaffDto);
  }

  @Get()
  async getStaffList(): Promise<PaginatedDto<any>> {
    return await this.staffsService.getStaffList();
  }

  @Get(':id')
  async getStaffById(id: number): Promise<any> {
    return await this.staffsService.getStaffById(id);
  }

  @Post(':id')
  async updateStaff(id: number): Promise<any> {
    return await this.staffsService.updateStaff(id);
  }

  @Delete(':id')
  async deleteStaff(id: number): Promise<any> {
    return await this.staffsService.deleteStaff(id);
  }
}
