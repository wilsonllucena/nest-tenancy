import { Controller, Get, Post, Req } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Request } from 'express';

@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) {}
  @Get()
  async index(): Promise<any> {
    return await this.service.find();
  }

  @Post()
  async create(@Req() req: Request): Promise<any> {
    const tenant = req.body;
    return await this.service.create(tenant);
  }
}
