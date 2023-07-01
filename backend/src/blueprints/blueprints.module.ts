import { Module } from "@nestjs/common";
import { BlueprintsController } from "./blueprints.controller";
import { BlueprintService } from "./blueprints.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BlueprintSchema } from "./schema";

@Module({
    imports : [
        MongooseModule.forFeature([{ name: 'Blueprint', schema: BlueprintSchema}])
    ],
    controllers: [
        BlueprintsController
    ],
    providers: [
        BlueprintService
    ]
})
export class BlueprintsModule {

}