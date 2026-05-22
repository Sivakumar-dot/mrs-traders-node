const fs = require('fs/promises');
const path = require('path');

const companySettingsFile = path.join(process.cwd(), 'src', 'data', 'company-settings.json');

const defaultCompanySettings = {
  companyName: '',
  companyService: '',
  ownerName: '',
  address: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  googleMapUrl: '',
  businessHours: ''
};

const normalizeCompanySettings = (settings = {}) => ({
  ...defaultCompanySettings,
  ...settings,
  googleMapUrl: settings.googleMapUrl || settings.mapUrl || ''
});

const ensureSettingsFile = async () => {
  await fs.mkdir(path.dirname(companySettingsFile), { recursive: true });

  try {
    await fs.access(companySettingsFile);
  } catch (error) {
    await fs.writeFile(
      companySettingsFile,
      `${JSON.stringify(defaultCompanySettings, null, 2)}\n`,
      'utf8'
    );
  }
};

const getCompanySettings = async () => {
  await ensureSettingsFile();
  const fileContent = await fs.readFile(companySettingsFile, 'utf8');
  const parsedContent = JSON.parse(fileContent);

  return normalizeCompanySettings(parsedContent);
};

const updateCompanySettings = async (payload) => {
  const currentSettings = await getCompanySettings();
  const normalizedPayload = {
    ...payload,
    googleMapUrl:
      typeof payload.googleMapUrl === 'string'
        ? payload.googleMapUrl
        : payload.mapUrl
  };
  const sanitizedSettings = Object.keys(defaultCompanySettings).reduce((settings, key) => {
    if (typeof normalizedPayload[key] === 'string') {
      settings[key] = normalizedPayload[key].trim();
      return settings;
    }

    settings[key] = currentSettings[key] || '';
    return settings;
  }, {});

  await fs.writeFile(
    companySettingsFile,
    `${JSON.stringify(sanitizedSettings, null, 2)}\n`,
    'utf8'
  );

  return sanitizedSettings;
};

module.exports = { getCompanySettings, updateCompanySettings };
