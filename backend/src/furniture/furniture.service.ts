import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFurniture } from './schema';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectModel('Furniture') private furnitureModel: Model<IFurniture>,
  ) {}

  async getAllFurniture(): Promise<IFurniture[]> {
    const furnitreData = await this.furnitureModel.find();
    if (!furnitreData || furnitreData.length == 0) {
      throw new NotFoundException('Furniture data not found!');
    }
    return furnitreData;
  }

}
