import { registerAs } from '@nestjs/config';

export default registerAs('dhis', () => ({
  api: process.env.DHIS2_BASE_URL,
  username: process.env.DHIS2_USERNAME,
  password: process.env.DHIS2_PASSWORD,
  apiToken: process.env.DHIS2_API_TOKEN,
  cacheTtl: process.env.CACHE_TTL,
  numberOfRequestsPerMinute: process.env.NUMBER_OF_REQUESTS_PER_MINUTE,
  readonlyResources: JSON.parse(process.env.READONLY_RESOURCES),
  allowedResources: JSON.parse(process.env.ALLOWED_RESOURCES),
}));
