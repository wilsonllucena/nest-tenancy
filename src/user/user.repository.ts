import { Inject, Injectable, Scope } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository {
  constructor(
    @Inject('TENANT_CONNECTION')
    private readonly connection: DataSource,
  ) {}

  async find() {
    return await this.connection.getRepository(User).find();
  }

  async findOne(id: number) {
    return await this.connection.getRepository(User).findOneBy({ id });
  }

  async save(data: User) {
    return await this.connection.getRepository(User).save(data);
  }
}
