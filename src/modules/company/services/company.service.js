const fs = require('fs/promises');
const path = require('path');
const { AppError } = require('../../../utils/appError');

const companySettingsFilePath = path.join(
  process.cwd(),
  'src',
  'modules',
  'company',
  'data',
  'company-settings.json'
);

const defaultCompanySettings = () => ({
  companyName: '',
  ownerName: '',
  address: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  mapUrl: '',
  businessHours: ''
});

const ensureCompanySettingsFile = async () => {
  await fs.mkdir(path.dirname(companySettingsFilePath), { recursive: true });

  try {
    await fs.access(companySettingsFilePath);
  } catch (error) {
    await fs.writeFile(
      companySettingsFilePath,
      JSON.stringify(defaultCompanySettings(), null, 2)
    );
  }
};

const readCompanySettings = async () => {
  await ensureCompanySettingsFile();

  try {
    const fileContent = await fs.readFile(companySettingsFilePath, 'utf-8');
    return {
      ...defaultCompanySettings(),
      ...JSON.parse(fileContent)
    };
  } catch (error) {
    throw new AppError('Failed to read company settings.', 500);
  }
};

const writeCompanySettings = async (settings) => {
  try {
    await fs.writeFile(companySettingsFilePath, JSON.stringify(settings, null, 2));
    return settings;
  } catch (error) {
    throw new AppError('Failed to update company settings.', 500);
  }
};

const getCompanySettings = async () => readCompanySettings();

const updateCompanySettings = async (payload) => {
  const currentSettings = await readCompanySettings();
  const updatedSettings = {
    ...currentSettings,
    ...payload
  };

  return writeCompanySettings(updatedSettings);
};

module.exports = {
  getCompanySettings,
  updateCompanySettings
};
