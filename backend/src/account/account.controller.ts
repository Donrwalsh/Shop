import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccount(@Res() response) {
    try {
      const accountData = await this.accountService.getAccount();
      return response.status(HttpStatus.OK).json(accountData);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
