import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquiryPageComponent } from './modules/enquiry/pages/enquiry-page/enquiry-page.component';

const routes: Routes = [
  {
    path: '',
    component: EnquiryPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
