import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KeycloakAdminService } from '@gaucho/nest-keycloak/admin';
import KcAdminClient from 'keycloak-admin';

@Injectable()
export class UsersService {
  client: KcAdminClient;

  constructor(keycloak: KeycloakAdminService) {
    keycloak.client().then((res) => (this.client = res));
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.username = createUserDto.email;
    return await this.client.users.create({
      ...createUserDto,
      realm: 'budega',
    });
  }

  async findAll() {
    return await this.client.users.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto}`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async createClient(createUserDto: CreateUserDto) {
    createUserDto.username = createUserDto.email;
    const { id } = await this.client.users.create({
      ...createUserDto,
      realm: 'budega',
    });
    return await this.client.users.addClientRoleMappings({
      id,
      clientUniqueId: 'dca74eea-acf0-432a-9627-c6f705b1927b',
      roles: [{ id: 'faa05aa6-b9ac-4401-8069-172ec27168d7', name: 'client' }],
      realm: 'budega',
    });
  }

  updateClient(id: string, updateUserDto: UpdateUserDto) {
    return { id, updateUserDto };
  }

  findClient(id: string) {
    return { id };
  }
}
