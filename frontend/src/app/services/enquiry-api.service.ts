import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { appConfig } from '../core/config/app.config';
import { ApiResponse } from '../core/models/api-response.model';
import { EnquiryRequest, EnquirySubmissionResult } from '../core/models/enquiry.model';

@Injectable({ providedIn: 'root' })
export class EnquiryApiService {
  private readonly endpoint = `${appConfig.apiBaseUrl}/enquiry`;

  constructor(private readonly http: HttpClient) {}

  submitEnquiry(payload: EnquiryRequest): Observable<ApiResponse<EnquirySubmissionResult>> {
    return this.http.post<ApiResponse<EnquirySubmissionResult>>(this.endpoint, payload);
  }
}
