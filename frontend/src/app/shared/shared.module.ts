import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormAlertComponent } from './components/form-alert/form-alert.component';

@NgModule({
  declarations: [FormAlertComponent],
  imports: [CommonModule],
  exports: [FormAlertComponent, CommonModule]
})
export class SharedModule {}
