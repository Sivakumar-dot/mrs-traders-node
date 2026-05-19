const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { appLogger } = require('../utils/logger');
const { APP_CONSTANTS } = require('../utils/constants');

let whatsappClient;
let reinitializeTimer;
let isReinitializing = false;
let isShuttingDown = false;
let clientState = {
  isReady: false,
  lastEvent: 'initializing'
};

const clearReinitializeTimer = () => {
  if (reinitializeTimer) {
    clearTimeout(reinitializeTimer);
    reinitializeTimer = null;
  }
};

const createAndInitializeClient = async () => {
  const client = buildClient();
  whatsappClient = client;
  registerEvents(client);
  await client.initialize();
  return client;
};

const scheduleReinitialize = (reason) => {
  if (isShuttingDown || isReinitializing || reinitializeTimer) {
    return;
  }

  clientState = {
    ...clientState,
    isReady: false,
    lastEvent: 'reinitializing'
  };

  reinitializeTimer = setTimeout(async () => {
    reinitializeTimer = null;

    if (isShuttingDown || whatsappClient) {
      return;
    }

    isReinitializing = true;

    try {
      appLogger.info('Reinitializing WhatsApp client.', { reason });
      await createAndInitializeClient();
    } catch (error) {
      whatsappClient = null;
      appLogger.error('WhatsApp client reinitialization failed.', { reason, error: error.message });
      scheduleReinitialize('retry_after_failure');
    } finally {
      isReinitializing = false;
    }
  }, 1500);
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
    appLogger.info('WhatsApp QR generated. Scan using the WhatsApp account that should stay connected.');
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

    if (whatsappClient === client) {
      whatsappClient = null;
    }

    scheduleReinitialize(reason);
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
  isShuttingDown = false;

  if (whatsappClient) {
    return whatsappClient;
  }

  return createAndInitializeClient();
};

const getWhatsAppClient = () => whatsappClient;

const getWhatsAppState = () => ({
  ...clientState
});

const destroyWhatsAppClient = async () => {
  isShuttingDown = true;
  clearReinitializeTimer();

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
