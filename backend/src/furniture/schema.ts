import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'furniture'})
export class Furniture {
  @Prop()
  _id: string;

  @Prop()
  type: string;
}
export const FurnitureSchema = SchemaFactory.createForClass(Furniture);

import { Document } from 'mongoose';
export interface IFurniture extends Document {
  readonly type: string;
}
