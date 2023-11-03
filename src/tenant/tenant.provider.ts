import 'reflect-metadata';
import { Provider, Scope } from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { Tenant } from './tenant.entity';
import { REQUEST } from '@nestjs/core';
import { User } from '../user/user.entity';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

export const TenantProvider: Provider = {
  provide: 'TENANT_CONNECTION',
  inject: [REQUEST, DataSource],
  scope: Scope.REQUEST,
  useFactory: async (req: Request, dataSource: DataSource) => {
    const name: string = req.headers['x-tenant'] as string;
    const tenant = await dataSource
      .getRepository(Tenant)
      .findOneBy({ code: name });

    return await new DataSource({
      name: tenant.database,
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: tenant.database,
      entities: [User],
    }).initialize();
  },
};
