import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { BlueprintService } from './blueprints.service';

@Controller('blueprint')
export class BlueprintsController {
  constructor(private readonly blueprintService: BlueprintService) {}

  @Get('/ref')
  async getBlueprintReference(@Res() response) {
    try {
      const blueprintData = await this.blueprintService.getAllBlueprintsRef();
      return response.status(HttpStatus.OK).json({
        message: 'Blueprints reference data found successfully',
        blueprintData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getBlueprint(@Res() response, @Param('id') blueprintId: string) {
    try {
      const existingBlueprint = await this.blueprintService.getBlueprint(
        blueprintId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Blueprint found successfully',
        existingBlueprint,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  async getBlueprints(@Res() response) {
    try {
      const blueprintData = await this.blueprintService.getAllBlueprints();
      return response.status(HttpStatus.OK).json({
        message: 'All blueprints data found successfully',
        blueprintData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
