import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [CommonModule, NgxDatatableModule, ReactiveFormsModule],
  declarations: [AccountComponent],
  exports: [AccountComponent],
})
export class AccountModule {}
