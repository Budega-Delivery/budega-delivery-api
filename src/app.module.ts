import { Module } from '@nestjs/common';

import { KCModule } from './keycloak/KCModule';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductModule, KCModule, UsersModule],
})
export class AppModule {}

/*
 * TODO: System add environment
 * TODO: add Logger (Resolve all index create, and log users activity and errors)

 * TODO: get variable from environment
 * TODO: Build to prod in docker image
 * TODO: Cart resource
 * TODO: Delivery resource
 * */
