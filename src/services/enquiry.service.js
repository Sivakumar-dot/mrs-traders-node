const enquiryRepository = require('../repositories/enquiry.repository');
const { sendAdminEnquiryNotification } = require('./whatsapp.service');
const { logActivity } = require('./activity-log.service');
const { APP_CONSTANTS } = require('../utils/constants');
const { buildEnquiryWhatsAppMessage } = require('../utils/messageTemplate');
const { generateReadableId } = require('../utils/idGenerator');

const createEnquiry = async ({ body, requestId, ipAddress }) => {
  const enquiryPayload = {
    enquiryId: generateReadableId(APP_CONSTANTS.ENQUIRY_PREFIX),
    customerName: body.name.trim(),
    customerMobile: body.mobile.trim(),
    customerMessage: body.message.trim(),
    ipAddress,
    whatsappStatus: APP_CONSTANTS.WHATSAPP_STATUS.PENDING,
    requestId
  };

  const enquiry = await enquiryRepository.createEnquiry(enquiryPayload);

  await logActivity({
    type: APP_CONSTANTS.ACTIVITY_TYPES.ENQUIRY_CREATED,
    message: `Enquiry created with ID ${enquiry.enquiryId}.`,
    requestId
  });

  const whatsappMessage = buildEnquiryWhatsAppMessage(enquiry);

  try {
    const delivery = await sendAdminEnquiryNotification(whatsappMessage);

    const updatedEnquiry = await enquiryRepository.updateWhatsAppStatus(
      enquiry.enquiryId,
      APP_CONSTANTS.WHATSAPP_STATUS.SENT
    );

    await logActivity({
      type: APP_CONSTANTS.ACTIVITY_TYPES.WHATSAPP_SENT,
      message: `WhatsApp message sent for enquiry ${enquiry.enquiryId}.`,
      requestId
    });

    return {
      enquiry: updatedEnquiry,
      whatsapp: {
        status: APP_CONSTANTS.WHATSAPP_STATUS.SENT,
        ...delivery
      }
    };
  } catch (error) {
    await enquiryRepository.updateWhatsAppStatus(enquiry.enquiryId, APP_CONSTANTS.WHATSAPP_STATUS.FAILED);

    await logActivity({
      type: APP_CONSTANTS.ACTIVITY_TYPES.WHATSAPP_FAILED,
      message: `WhatsApp delivery failed for enquiry ${enquiry.enquiryId}: ${error.message}`,
      requestId
    });

    return {
      enquiry: {
        ...enquiry.toObject(),
        whatsappStatus: APP_CONSTANTS.WHATSAPP_STATUS.FAILED
      },
      whatsapp: {
        status: APP_CONSTANTS.WHATSAPP_STATUS.FAILED,
        error: error.message
      }
    };
  }
};

module.exports = { createEnquiry };
