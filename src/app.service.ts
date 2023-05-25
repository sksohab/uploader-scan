import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  heartBeat(): boolean {
    return true;
  }
}
