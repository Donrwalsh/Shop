import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { LevelsService } from './levels.service';

@Controller('levels')
export class LevelsController {
    constructor(private readonly levelsService: LevelsService) {}

    @Get()
    async getLevels(@Res() response) {
        try {
            const levelData = await this.levelsService.getAllLevels();
            return response.status(HttpStatus.OK).json({
                message: 'All levels found successfully',
                levelData
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}