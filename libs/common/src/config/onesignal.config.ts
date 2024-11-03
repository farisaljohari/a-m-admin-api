import { registerAs } from '@nestjs/config';

export default registerAs(
  'onesignal-config',
  (): Record<string, any> => ({
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
    ONESIGNAL_API_KEY: process.env.ONESIGNAL_API_KEY,
  }),
);
