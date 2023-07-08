import { Module } from '@nestjs/common';
import { FurnitureController } from './furniture.controller';
import { FurnitureService } from './furniture.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FurnitureSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Furniture', schema: FurnitureSchema }]),
  ],
  controllers: [FurnitureController],
  providers: [FurnitureService],
})
export class FurnitureModule {}
