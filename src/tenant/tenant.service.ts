import { Injectable } from '@nestjs/common';
import { Tenant } from './tenant.entity';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async findOne(name: string): Promise<Tenant | null> {
    return await this.tenantRepository.findOne(name);
  }

  async find(): Promise<Tenant[]> {
    return await this.tenantRepository.find();
  }

  async create(tenant: Tenant): Promise<Tenant> {
    return await this.tenantRepository.save(tenant);
  }
}
