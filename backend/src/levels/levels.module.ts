import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelSchema } from './schema';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Level', schema: LevelSchema },
    ]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {}
