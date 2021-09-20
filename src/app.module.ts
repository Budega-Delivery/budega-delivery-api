import { Module } from '@nestjs/common';

import { KCModule } from './keycloak/KCModule';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProductModule,
    KCModule,
    UsersModule,
  ],
})
export class AppModule {}

/*
 * TODO: add Logger (Resolve all index create, and log users activity and errors)
 * TODO: Build to prod in docker image
 * TODO: Cart resource
 * TODO: Delivery resource
 * TODO: git secret
 * */
