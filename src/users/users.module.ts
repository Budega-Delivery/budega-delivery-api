import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KCService } from '../keycloak/keycloak.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, KCService],
})
export class UsersModule {}
