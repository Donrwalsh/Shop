import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlueprintsModule } from './blueprints/blueprints.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelsModule } from './levels/levels.module';

@Module({
  imports: [
    BlueprintsModule,
    LevelsModule,
    MongooseModule.forRoot('mongodb://192.168.1.11:27017', {
      dbName: 'shopData',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
