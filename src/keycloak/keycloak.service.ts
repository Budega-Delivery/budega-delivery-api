import { HttpException, Injectable } from '@nestjs/common';
import KcAdminClient from 'keycloak-admin';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';

@Injectable()
export class KCService {
  kcAdminClient: KcAdminClient;
  client = { name: 'budega-app', id: 'b78ad266-5b08-444f-8fa0-acd19e5d9814' };

  constructor() {
    this.kcAdminClient = new KcAdminClient({
      baseUrl: 'http://localhost:8081/auth',
      realmName: 'budega',
    });
  }

  protected async connect(): Promise<void> {
    return await this.kcAdminClient.auth({
      username: 'api',
      password: 'seinao',
      clientId: 'budega-api',
      grantType: 'password',
      clientSecret: 'f529a2ee-e44b-4435-9e8e-04fa2eb30707',
    });
  }

  async getUsersWithRole(role: string): Promise<UserRepresentation[]> {
    await this.connect();
    // return await this.kcAdminClient.users.find();
    return await this.kcAdminClient.clients.findUsersWithRole({
      id: this.client.id,
      roleName: role,
    });
  }

  async getClientRoles(): Promise<RoleRepresentation[]> {
    await this.connect();
    return this.kcAdminClient.clients.listRoles({ id: this.client.id });
  }

  async getUserInfo(token: string): Promise<UserRepresentation> {
    await this.connect();
    return await this.kcAdminClient.keycloak.getUserInfo(token);
  }

  async addUser(
    newUser: UserRepresentation,
    role: string,
    client?: string,
  ): Promise<void> {
    await this.connect();
    const user = await this.kcAdminClient.users.create(newUser);
    /*
    *  id: string;
        clientUniqueId: string;
        roles: RoleMappingPayload[]  ->
          * id: string;
          *name: string;;
        * */
    //TODO: ao startar app pegar todos os ids dos clients e das roles
    //TODO: Move this to .env
    const roleInfo = await this.kcAdminClient.roles.findOneByName({
      name: role,
    });
    if (!roleInfo) throw new HttpException('Invalid Role', 400);
    return await this.kcAdminClient.users.addClientRoleMappings({
      id: user.id,
      clientUniqueId: client || this.client.id,
      roles: [{ id: roleInfo.id, name: roleInfo.name }],
    });
  }

  async getUserById(id: string) {
    await this.connect();
    let user = await this.kcAdminClient.users.findOne({ id: id });
    let roles: RoleRepresentation[];
    if (user) {
      roles = await this.kcAdminClient.users.listClientRoleMappings({
        id: user.id,
        clientUniqueId: this.client.id,
      });
      user = { ...user, clientRoles: roles };
    }
    return user;
  }

  async updateUserAvatar(id: string, imagePath: string) {
    await this.connect();
    const user = await this.kcAdminClient.users.findOne({ id: id });
    if (user)
      return await this.kcAdminClient.users.update(
        { id },
        {
          attributes: { avatar: imagePath },
        },
      );
  }

  async activeUser(id: string, state: boolean) {
    await this.connect();
    return await this.kcAdminClient.users.update(
      { id: id },
      {
        enabled: state,
      },
    );
  }
}
