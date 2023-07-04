import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISlot } from './schema';

@Injectable()
export class SlotsService {
  constructor(@InjectModel('Slot') private slotModel: Model<ISlot>) {}

  async getShopExpansionSlots(): Promise<ISlot[]> {
    const shopExpansionSlotsData = await this.slotModel.find({
      type: 'Shop Expansion',
    });
    if (!shopExpansionSlotsData) {
      throw new NotFoundException('shop expansion data not found!');
    }
    return shopExpansionSlotsData;
  }
}
