import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Account {
  @Prop()
  _id: string;

  @Prop()
  level: number;

  @Prop()
  xp: number;

  @Prop()
  furnitureSlots: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

import { Document } from 'mongoose';
export interface IAccount extends Document {
  readonly level: number;
  readonly xp: number;
  readonly furnitureSlots: number;
}

import { IsNotEmpty, IsNumber, } from "class-validator";
import { PartialType } from '@nestjs/swagger';

export class CreateAccountDto {
  @IsNumber()
  @IsNotEmpty()
  readonly level: number;

  @IsNumber()
  @IsNotEmpty()
  readonly xp: number;

  @IsNumber()
  @IsNotEmpty()
  readonly furnitureSlots: number;
}

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}