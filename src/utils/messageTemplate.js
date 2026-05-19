const { envConfig } = require('../config/env.config');
const { formatDateTime } = require('./dateFormatter');

const buildEnquiryWhatsAppMessage = (enquiry) => {
  return [
    '📩 New Enquiry',
    '',
    '🆔 Enquiry ID:',
    enquiry.enquiryId,
    '',
    '🏢 Company:',
    envConfig.companyName,
    envConfig.companyType,
    '',
    '👤 Customer Name:',
    enquiry.customerName,
    '',
    '📞 Customer Mobile:',
    enquiry.customerMobile,
    '',
    '💬 Message:',
    enquiry.customerMessage,
    '',
    '🕒 Timestamp:',
    formatDateTime(enquiry.createdAt || new Date())
  ].join('\n');
};

module.exports = { buildEnquiryWhatsAppMessage };
