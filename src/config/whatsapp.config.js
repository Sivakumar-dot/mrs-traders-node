const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { appLogger } = require('../utils/logger');
const { APP_CONSTANTS } = require('../utils/constants');

let whatsappClient;
let clientState = {
  isReady: false,
  lastEvent: 'initializing'
};

const buildClient = () =>
  new Client({
    authStrategy: new LocalAuth({
      clientId: APP_CONSTANTS.WHATSAPP_DEFAULT_CLIENT_ID,
      dataPath: path.join(process.cwd(), 'whatsapp-session', 'auth-files')
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

const registerEvents = (client) => {
  client.on('qr', (qr) => {
    clientState = {
      ...clientState,
      isReady: false,
      lastEvent: 'qr'
    };
    qrcode.generate(qr, { small: true });
    appLogger.info('WhatsApp QR generated. Scan using the admin device.');
  });

  client.on('ready', () => {
    clientState = {
      ...clientState,
      isReady: true,
      lastEvent: 'ready'
    };
    appLogger.info('WhatsApp client is ready.');
  });

  client.on('authenticated', () => {
    clientState = {
      ...clientState,
      lastEvent: 'authenticated'
    };
    appLogger.info('WhatsApp client authenticated successfully.');
  });

  client.on('auth_failure', (message) => {
    clientState = {
      ...clientState,
      isReady: false,
      lastEvent: 'auth_failure'
    };
    appLogger.error('WhatsApp authentication failure.', { message });
  });

  client.on('disconnected', async (reason) => {
    clientState = {
      ...clientState,
      isReady: false,
      lastEvent: 'disconnected'
    };
    appLogger.error('WhatsApp client disconnected.', { reason });

    try {
      await client.destroy();
    } catch (error) {
      appLogger.error('Failed to destroy disconnected WhatsApp client.', { error: error.message });
    }

    whatsappClient = buildClient();
    registerEvents(whatsappClient);
    await whatsappClient.initialize();
  });

  client.on('loading_screen', (percent, message) => {
    clientState = {
      ...clientState,
      lastEvent: 'loading_screen'
    };
    appLogger.info('WhatsApp loading screen update.', { percent, message });
  });
};

const initializeWhatsAppClient = async () => {
  if (whatsappClient) {
    return whatsappClient;
  }

  whatsappClient = buildClient();
  registerEvents(whatsappClient);
  await whatsappClient.initialize();
  return whatsappClient;
};

const getWhatsAppClient = () => whatsappClient;

const getWhatsAppState = () => ({
  ...clientState
});

const destroyWhatsAppClient = async () => {
  if (!whatsappClient) {
    return;
  }

  try {
    await whatsappClient.destroy();
    appLogger.info('WhatsApp client destroyed successfully.');
  } finally {
    whatsappClient = null;
    clientState = {
      isReady: false,
      lastEvent: 'destroyed'
    };
  }
};

module.exports = {
  initializeWhatsAppClient,
  getWhatsAppClient,
  getWhatsAppState,
  destroyWhatsAppClient
};
