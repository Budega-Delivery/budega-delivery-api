import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakModule } from '@gaucho/nest-keycloak';

import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { session } from '../main';
import { KeycloakAdminModule } from '@gaucho/nest-keycloak/admin';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8081/auth',
      realm: 'budega',
      clientId: 'budega-api',
      secret: '8021efef-62fe-4a5d-8573-4a681b039a45',
    }),

    KeycloakModule.forRoot({
      serverUrl: 'http://localhost:8081/auth',
      realm: 'budega',
      clientId: 'budega-app',
      session,
    }),

    KeycloakAdminModule.forRoot({
      serverUrl: 'http://localhost:8081/auth',
      realm: 'budega',
      adminUser: 'api',
      adminPwd: 'seinaoapi',
    }),
  ],
  providers: [
    // These are in order, see https://docs.nestjs.com/guards#binding-guards
    // for more information

    // This adds a global level authentication guard, you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class KCModule {}
