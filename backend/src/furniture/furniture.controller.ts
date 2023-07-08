import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import {FurnitureService} from './furniture.service';

@Controller('furniture')
export class FurnitureController {
    constructor(private readonly furnitureService: FurnitureService) {}

    @Get()
    async getFurniture(@Res() response) {
        try {
            const furnitureData = await this.furnitureService.getAllFurniture()
            return response.status(HttpStatus.OK).json(furnitureData)
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}