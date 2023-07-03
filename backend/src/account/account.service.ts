import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAccount } from './schema';

@Injectable()
export class AccountService {
  constructor(@InjectModel('Account') private accountModel: Model<IAccount>) {}

  async getAccount(): Promise<IAccount> {
    const accountData = await this.accountModel.findById('bigbrass');
    if (!accountData) {
      throw new NotFoundException('account data not found!');
    }
    return accountData;
  }
}
