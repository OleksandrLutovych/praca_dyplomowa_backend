import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(params: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.usersRepository.findOne(params);
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.usersRepository.findMany(params);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.usersRepository.create(data);
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.usersRepository.update(params);
  }

  async deleteUser(id: number): Promise<User> {
    return this.usersRepository.delete({ id });
  }
}
