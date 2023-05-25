import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import NodeClam = require('clamscan');
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  heartBeat(): boolean {
    return this.appService.heartBeat();
  }

  @Post('/scanFile')
  @UseInterceptors(FileInterceptor('file'))
  async scanFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(+process.env.CLAMAV_PORT);
    const clamscan = await new NodeClam().init({
      debugMode: true,
      clamdscan: {
        host: 'host.docker.internal',
        port: +process.env.CLAMAV_PORT || 3310,
      },
    });
    const { originalname, buffer } = file;
    const stream = Readable.from(buffer);
    const { isInfected, viruses } = await clamscan.scanStream(stream);
    if (isInfected) {
      return {
        isInfected: isInfected,
        message: `File: ${originalname} may be infected. Viruses found: ${viruses}`,
      };
    }
    return { isInfected: isInfected, message: `File: ${originalname} is OK` };
  }
}
