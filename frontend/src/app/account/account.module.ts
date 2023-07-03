import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [AccountComponent],
  exports: [AccountComponent],
})
export class AccountModule {}
