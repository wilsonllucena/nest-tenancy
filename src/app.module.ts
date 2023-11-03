import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TenantModule } from './tenant/tenant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TenantModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          port: +config.get('DB_PORT'),
          database: config.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: false,
        } as any;
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
