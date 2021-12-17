import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

export class CreateUserDto {
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  role?: RoleRepresentation;
}
