import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { DB } from 'src/database/database';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { Kysely } from 'kysely';
import { FastifyRequest } from 'fastify';
import { PageOptionsDto, PaginatedDto, UserRole } from 'src/common';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}

  private readonly admin = [
    {
      id: 1,
      email: 'admin',
      password: '123Admin',
    },
  ];

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      // verify user exists or not
      const existingUser = await this.db
        .selectFrom('users')
        .select('email')
        .where('email', '=', createUserDto.email)
        .execute();
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // hash password
      const passwordHash = await bcrypt.hash(
        createUserDto.password,
        this.saltRounds,
      );

      // create new user
      const newUser = await this.db
        .insertInto('users')
        .values({
          email: createUserDto.email,
          password: passwordHash,
          username: createUserDto.username,
          role: createUserDto.role.map(
            (role) => role as 'admin' | 'super_admin' | 'doctor' | 'patient',
          ),
        })
        .returningAll()
        .execute();

      return newUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(username: string): Promise<UserDto[]> {
    return await this.db
      .selectFrom('users')
      .select(['id', 'email', 'password', 'username', 'role'])
      .where('username', '=', username)
      .execute();
  }

  // async updateUser(
  //   req: FastifyRequest,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<any> {
  //   return await '';
  // }

  // async removeUser(req: FastifyRequest, id: string): Promise<void> {
  //   return await '';
  // }

  // async getUsers(
  //   req: FastifyRequest,
  //   getUsersDto: any,
  //   pageOptionsDto: PageOptionsDto,
  // ): Promise<PaginatedDto<any>> {
  //   return await '';
  // }

  // async findAll(): Promise<any> {
  //   return await '';
  // }
}
