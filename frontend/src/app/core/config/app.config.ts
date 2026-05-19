import { environment } from '../../../environments/environment';

export const appConfig = {
  appName: environment.companyName,
  businessType: environment.companyType,
  apiBaseUrl: environment.apiBaseUrl
};
