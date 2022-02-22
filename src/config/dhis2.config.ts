import { registerAs } from '@nestjs/config';

export default registerAs('dhis', () => ({
  api: process.env.DHIS2_BASE_URL,
  username: process.env.DHIS2_USERNAME,
  password: process.env.DHIS2_PASSWORD,
}));
