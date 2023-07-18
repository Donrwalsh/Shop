import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBlueprint } from './schema';

@Injectable()
export class BlueprintService {
  constructor(
    @InjectModel('Blueprint') private blueprintModel: Model<IBlueprint>,
  ) {}

  async getAllBlueprints(): Promise<IBlueprint[]> {
    const blueprintData = await this.blueprintModel.find();
    if (!blueprintData || blueprintData.length == 0) {
      throw new NotFoundException('Blueprint data not found!');
    }
    return blueprintData;
  }

  async getAllBlueprintsRef(): Promise<Partial<IBlueprint>[]> {
    const blueprintData = await this.blueprintModel.find();
    if (!blueprintData || blueprintData.length == 0) {
      throw new NotFoundException('Blueprint data not found!');
    }
    return blueprintData.map((bpData) => {
      return { id: bpData.id, name: bpData.name };
    });
  }

  async getBlueprint(blueprintId: string): Promise<IBlueprint> {
    const existingBlueprint = await this.blueprintModel
      .findById(blueprintId)
      .exec();
    if (!existingBlueprint) {
      throw new NotFoundException(`Blueprint #${blueprintId} not found`);
    }
    return existingBlueprint;
  }
}
