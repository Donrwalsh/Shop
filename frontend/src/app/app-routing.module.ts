import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlueprintComponent } from './blueprint/blueprint.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: 'blueprint', component: BlueprintComponent },
  { path: 'account', component: AccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
