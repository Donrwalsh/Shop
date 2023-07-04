import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Slot {
  @Prop()
  _id: string;

  @Prop()
  type: string;
}
export const SlotSchema = SchemaFactory.createForClass(Slot);

import { Document } from 'mongoose';
export interface ISlot extends Document {
  readonly type: string;
}
