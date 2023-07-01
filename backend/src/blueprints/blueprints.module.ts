import { Module } from "@nestjs/common";
import { BlueprintsController } from "./blueprints.controller";

@Module({
    controllers: [
        BlueprintsController
    ]
})
export class BlueprintsModule {

}