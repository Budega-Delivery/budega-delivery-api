import { Module } from '@nestjs/common';

import { KCModule } from './keycloak/KCModule';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ProductModule, KCModule, UsersModule],
})
export class AppModule {}
