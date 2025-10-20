import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PageOptionsDto, PaginatedDto, Roles, UserRole } from 'src/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { FastifyRequest } from 'fastify';
import { UserDto } from './dtos/user.dto';

@ApiBearerAuth('access-token')
// @Roles(UserRole.SuperAdmin, UserRole.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('')
  async getUser(@Query('username') username: string): Promise<UserDto[]> {
    return await this.usersService.getUser(username);
  }

  // @Put('update')
  // async updateUser(
  //   @Req() req: FastifyRequest,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return await this.usersService.updateUser(req, updateUserDto);
  // }

  // @Delete(':id')
  // async removeUser(@Req() req: FastifyRequest, @Query('id') id: string) {
  //   return await this.usersService.removeUser(req, id);
  // }

  // @Get('list')
  // async getUsers(
  //   @Req() req: FastifyRequest,
  //   @Query() getUsersDto: any,
  //   @Query() pageOptionsDto: PageOptionsDto,
  // ): Promise<PaginatedDto<any>> {
  //   return await this.usersService.getUsers(req, getUsersDto, pageOptionsDto);
  // }

  // @Post('signout')
  // async signOut(req: FastifyRequest) {
  //   return await this.usersService.signOut(req);
  // }
}
