import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async findAll(): Promise<any[]> {
    return this.repository.find();
  }

  async create(data: any): Promise<any> {
    return this.repository.save(data);
  }
}
