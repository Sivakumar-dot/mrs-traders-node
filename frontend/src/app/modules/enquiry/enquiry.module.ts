import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EnquiryPageComponent } from './pages/enquiry-page/enquiry-page.component';

@NgModule({
  declarations: [EnquiryPageComponent],
  imports: [SharedModule, ReactiveFormsModule],
  exports: [EnquiryPageComponent]
})
export class EnquiryModule {}
