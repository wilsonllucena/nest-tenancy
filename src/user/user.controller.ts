import { Controller, Get, Post, Req } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Req() req: Request): Promise<User> {
    return this.userService.create(req.body);
  }
}
