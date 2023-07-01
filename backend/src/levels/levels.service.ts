import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILevel } from './schema';

@Injectable()
export class LevelsService {
    constructor(
        @InjectModel('Level') private levelModel: Model<ILevel>,
    ) {}

    async getAllLevels(): Promise<ILevel[]> {
        const levelData = await this.levelModel.find();
        if (!levelData || levelData.length == 0) {
            throw new NotFoundException('level data not found!');
        }
        return levelData;
    }
}