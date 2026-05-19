import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { EnquiryApiService } from '../../../../services/enquiry-api.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { EnquirySubmissionResult } from '../../../../core/models/enquiry.model';

@Component({
  selector: 'app-enquiry-page',
  templateUrl: './enquiry-page.component.html',
  styleUrls: ['./enquiry-page.component.css']
})
export class EnquiryPageComponent {
  submitting = false;
  successMessage = '';
  errorMessage = '';

  readonly enquiryForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
    message: ['', [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly enquiryApiService: EnquiryApiService
  ) {}

  submit(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.enquiryApiService.submitEnquiry(this.enquiryForm.getRawValue() as { name: string; mobile: string; message: string })
      .subscribe({
        next: (response: ApiResponse<EnquirySubmissionResult>) => {
          this.submitting = false;
          this.successMessage = `Enquiry submitted successfully. Reference: ${response.data.enquiry.enquiryId}`;
          this.enquiryForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.submitting = false;
          this.errorMessage = error.error?.message || 'Unable to submit enquiry right now.';
        }
      });
  }

  get nameControl() {
    return this.enquiryForm.controls.name;
  }

  get mobileControl() {
    return this.enquiryForm.controls.mobile;
  }

  get messageControl() {
    return this.enquiryForm.controls.message;
  }
}
