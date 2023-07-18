import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlueprintComponent } from './blueprint/blueprint.component';
import { AccountComponent } from './account/account.component';
import { BlueprintDetailComponent } from './blueprint-detail/blueprint-detail.component';

const routes: Routes = [
  { path: 'blueprint', component: BlueprintComponent },
  { path: 'account', component: AccountComponent },
  { path: 'blueprint/:id', component: BlueprintDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
