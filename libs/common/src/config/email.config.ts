import { registerAs } from '@nestjs/config';
import { BooleanValues } from '../constants/boolean-values.enum';

export default registerAs(
  'email-config',
  (): Record<string, any> => ({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT),
    SMTP_SECURE: process.env.SMTP_SECURE === BooleanValues.TRUE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_SENDER: process.env.SMTP_SENDER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  }),
);
