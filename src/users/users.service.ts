import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KCService } from '../keycloak/keycloak.service';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';

@Injectable()
export class UsersService {
  kc: KCService;

  constructor(keycloak: KCService) {
    this.kc = keycloak;
  }

  async create(createUserDto: CreateUserDto) {
    // TODO: Fix This
    createUserDto.username = createUserDto.email;
    createUserDto.username = createUserDto.email;
    const role = createUserDto.role;
    delete createUserDto.role;
    return await this.kc.addUser(createUserDto, role);
  }

  async findAll() {
    const roles = await this.kc.getClientRoles();
    if (!roles.length) throw new HttpException('Invalid Content', 403);
    const response: UserRepresentation[] = [];
    for (const r of roles) {
      const res = await this.kc.getUsersWithRole(r.name);
      res.forEach((u) => {
        u['clientRoles'] = r;
        response.push(u);
      });
    }
    return response;
  }

  async findOneUser(id: string) {
    return await this.kc.getUserById(id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    // TODO: Implements
    return `This action updates a #${id} user ${updateUserDto}`;
  }

  remove(id: string) {
    // TODO: Implements
    return `This action removes a #${id} user`;
  }

  async createClient(createUserDto: CreateUserDto) {
    // TODO: Fix This
    createUserDto.username = createUserDto.email;
    return await this.kc.addUser(createUserDto, 'client');
  }

  updateClient(id: string, updateUserDto: UpdateUserDto) {
    // TODO: Implements
    return { id, updateUserDto };
  }

  getClientInfo(id: string) {
    // TODO: Implements
    return { id };
  }

  async getAllRoles() {
    return await this.kc.getClientRoles();
  }

  async updateUserImage(id: string, imagePath: string) {
    // TODO: save image in user attribute keycloak
    return this.kc.updateUserAvatar(id, imagePath);
  }
}
