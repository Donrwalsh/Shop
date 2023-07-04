import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotSchema } from './schema';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Slot', schema: SlotSchema }])],
  controllers: [SlotsController],
  providers: [SlotsService],
})
export class SlotsModule {}
