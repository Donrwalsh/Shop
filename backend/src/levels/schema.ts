import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Level {
  @Prop()
  _id: string;

  @Prop()
  level: number;
}
export const LevelSchema = SchemaFactory.createForClass(Level);

import { Document } from 'mongoose';
export interface ILevel extends Document {
  readonly _id: string;
  readonly level: number;
}
