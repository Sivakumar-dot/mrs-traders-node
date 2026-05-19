const { getWhatsAppClient, getWhatsAppState } = require('../config/whatsapp.config');
const { envConfig } = require('../config/env.config');

const normalizeWhatsAppNumber = (mobile) => `${String(mobile).replace(/\D/g, '')}@c.us`;

const isWhatsAppReady = () => {
  const state = getWhatsAppState();
  return state.isReady;
};

const sendTextMessage = async ({ mobile, message }) => {
  const client = getWhatsAppClient();

  if (!client || !isWhatsAppReady()) {
    const error = new Error('WhatsApp client is not ready.');
    error.statusCode = 503;
    throw error;
  }

  const chatId = normalizeWhatsAppNumber(mobile);
  const response = await client.sendMessage(chatId, message);

  return {
    chatId,
    messageId: response.id?._serialized || null
  };
};

const sendAdminEnquiryNotification = async (message) => {
  return sendTextMessage({
    mobile: envConfig.adminWhatsApp,
    message
  });
};

module.exports = {
  isWhatsAppReady,
  sendTextMessage,
  sendAdminEnquiryNotification
};
