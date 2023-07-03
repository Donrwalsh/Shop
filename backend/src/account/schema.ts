import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Account {
  @Prop()
  _id: string;

  @Prop()
  level: number;
}
export const AccountSchema = SchemaFactory.createForClass(Account);

import { Document } from 'mongoose';
export interface IAccount extends Document {
  readonly level: number;
}
