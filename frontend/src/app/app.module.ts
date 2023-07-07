import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AccountModule } from './account/account.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { EffectsModule } from '@ngrx/effects';
import { ROOT_REDUCERS } from './state/app.state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { DataEffects } from './state/data/data.effects';
import { metaReducers } from './state/meta.reducer';
import { AccountEffects } from './state/account/account.effects';
// import { metaReducers } from './state/meta.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AccountModule,
    NgxDatatableModule,
    EffectsModule.forRoot([AccountEffects, DataEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      // logOnly: environment.production
    }),
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
