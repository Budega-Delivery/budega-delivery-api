import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KCService } from '../keycloak/keycloak.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // TODO: move this url to config
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, KCService],
})
export class UsersModule {}
