import { Controller, Get } from "@nestjs/common";
import { Blueprint } from "./model";

@Controller()
export class BlueprintsController {

    @Get('/blueprint')
    getBlueprint(): string {
      return "Blueprint";
    }

    @Get('/blueprints')
    async getAllBlueprints(): Promise<Blueprint[]> {
        return new Promise((resolve) => {
            resolve([{name: "Squire Sword"}] as Blueprint[])
        })
    }
}