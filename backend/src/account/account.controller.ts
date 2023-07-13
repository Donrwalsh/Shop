import { Body, Controller, Get, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateAccountDto } from './schema';

@Controller('account')
@ApiTags("Account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/:id')
  async getAccount(@Res() response, @Param('id') accountId: string) {
    try {
      const accountData = await this.accountService.getAccountById(accountId);
      return response.status(HttpStatus.OK).json(accountData);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Put('/:id')
  @ApiBody({
    description: 'update account',
    schema: {
      example: {
        level: 80,
        xp: 8675309,
        furnitureSlots: 88
      }
    }
  })
  async updateAccount(
    @Res() response,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto
  ) {
    try {
      const existingAccount = await this.accountService.updateAccount(id, updateAccountDto);

      return response.status(HttpStatus.OK).json({
        message: 'Account has been successfully updated',
        existingAccount
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
