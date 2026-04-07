import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      ok: true,
      service: 'sellflow-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
