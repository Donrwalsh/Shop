import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Blueprint {
  @Prop()
  _id: string;

  @Prop()
  name: string;
}
export const BlueprintSchema = SchemaFactory.createForClass(Blueprint);

import { Document } from 'mongoose';
export interface IBlueprint extends Document {
  readonly name: string;
}
