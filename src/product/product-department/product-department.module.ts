import { Module } from '@nestjs/common';
import { ProductDepartmentService } from './product-department.service';
import { ProductDepartmentController } from './product-department.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductDepartmentController],
  providers: [ProductDepartmentService],
})
export class ProductDepartmentModule {}
