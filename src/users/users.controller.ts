import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, Roles } from 'nest-keycloak-connect';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/image-upload.utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('client')
  @Public()
  createClient(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createClient(createUserDto);
  }

  @Post()
  @Roles('budega-app:manager')
  create(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('budega-app:manager')
  getUsers() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('budega-app:manager')
  getRoles() {
    return this.usersService.getAllRoles();
  }

  @Get(':id')
  @Roles('budega-app:manager')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Get('client/:id')
  @Roles('budega-app:client')
  findClient(@Param('id') id: string) {
    return this.usersService.getClientInfo(id);
  }

  @Put('client/:id')
  @Roles('budega-app:manager', 'budega-app:client')
  updateClient(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateClient(id, updateUserDto);
  }

  @Put(':id')
  @Roles('budega-app:manager')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Post('image/:id')
  @Roles('budega-app:manager')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `./uploads`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.usersService.updateUserImage(String(id), image.path);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
