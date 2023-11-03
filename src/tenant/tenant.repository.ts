import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/repository.abstract';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantRepository extends AbstractRepository<Tenant> {
  constructor(@InjectEntityManager() manager: EntityManager) {
    super(Tenant, manager);
  }

  async find(): Promise<Tenant[]> {
    return this.repository.find();
  }

  async findOne(name: string): Promise<Tenant> {
    return this.repository.findOne({
      where: { code: name },
    });
  }
}
