import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { KeycloakAuthGuard } from '../keycloak/keycloak.auth.guard';
import { Roles } from '../keycloak/keycloak.decorator';
import { KeycloakUserContext } from '../keycloak/utils/user.context';
import { ObjectId } from 'mongodb';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(KeycloakAuthGuard)
  @Roles(['budega-app:client'])
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @KeycloakUserContext() user: UserRepresentation,
  ) {
    const result = await this.ordersService.create(createOrderDto, user);
    return result.insertedId;
  }

  @Get()
  @UseGuards(KeycloakAuthGuard)
  async findAll(
    @KeycloakUserContext() user: UserRepresentation,
    @KeycloakUserContext() userRole: RoleRepresentation,
  ) {
    return await this.ordersService.findAll(user, userRole);
  }

  @Get(':id')
  @UseGuards(KeycloakAuthGuard)
  async findOne(
    @Param('id') id: ObjectId,
    @KeycloakUserContext() user: UserRepresentation,
    @KeycloakUserContext() userRole: RoleRepresentation,
  ) {
    return await this.ordersService.findOne(id, user, userRole);
  }

  @Patch(':id')
  @UseGuards(KeycloakAuthGuard)
  async update(
    @Param('id') id: ObjectId,
    @Body() updateOrderDto: UpdateOrderDto,
    @KeycloakUserContext() user: UserRepresentation,
    @KeycloakUserContext() userRole: RoleRepresentation,
  ) {
    return await this.ordersService.update(id, updateOrderDto, user, userRole);
  }

  @Delete(':id')
  @UseGuards(KeycloakAuthGuard)
  async remove(
    @Param('id') id: ObjectId,
    @KeycloakUserContext() user: UserRepresentation,
  ) {
    return await this.ordersService.remove(id, user);
  }
}