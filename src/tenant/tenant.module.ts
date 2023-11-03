import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { NextFunction, Request, Response } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TenantRepository } from './tenant.repository';
import { User } from 'src/user/user.entity';
import { TenantProvider } from './tenant.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, User])],
  controllers: [TenantController],
  providers: [
    TenantService,
    TenantRepository,
    TenantProvider,
    {
      provide: 'TenantRepository',
      useClass: Repository,
    },
  ],
  exports: [TenantProvider],
})
export class TenantModule {
  constructor(
    private connection: DataSource,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.headers['x-tenant'] as string;
        const tenant: Tenant = await this.tenantService.findOne(name);

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'This tenant does not exists',
          );
        }

        try {
          this.connection = await new DataSource({
            name: tenant.database,
            type: 'postgres',
            driver: this.configService.get('DB_DRIVER'),
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: tenant.database,
            entities: [User],
            synchronize: true,
          }).initialize();

          next();
        } catch (e) {
          await this.connection.query(`CREATE DATABASE ${name}`);

          const createdConnection: DataSource = new DataSource({
            name: tenant.database,
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: tenant.database,
            entities: [User],
            synchronize: true,
          });

          await createdConnection.initialize();
          if (createdConnection.isInitialized) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      })
      .exclude({ path: '/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
