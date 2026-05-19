export interface EnquiryRequest {
  name: string;
  mobile: string;
  message: string;
}

export interface EnquiryRecord {
  enquiryId: string;
  customerName: string;
  customerMobile: string;
  customerMessage: string;
  ipAddress: string | null;
  whatsappStatus: string;
  requestId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquirySubmissionResult {
  enquiry: EnquiryRecord;
  whatsapp: {
    status: string;
    chatId?: string;
    messageId?: string | null;
    error?: string;
  };
}
