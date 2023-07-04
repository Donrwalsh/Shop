import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('/shopExpansions')
  async getShopExpansionSlots(@Res() response) {
    try {
      const shopExpansionSlotsData =
        await this.slotsService.getShopExpansionSlots();
      return response.status(HttpStatus.OK).json(shopExpansionSlotsData);
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
