import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomeMessage(): string {
    return 'Hello, welcome to DHIS2 mediator API!';
  }
}
