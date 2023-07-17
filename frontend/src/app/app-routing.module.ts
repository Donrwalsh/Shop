import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlueprintComponent } from './blueprint/blueprint.component';

const routes: Routes = [{ path: 'blueprint', component: BlueprintComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
