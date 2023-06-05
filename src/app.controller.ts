import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
    const clamscan = await new NodeClam().init({
      debugMode: true,
      clamdscan: {
        host: 'host.docker.internal',
        port: +process.env.CLAMAV_PORT || 3310,
      },
    });
    const { originalname, buffer } = file;
    const stream = Readable.from(buffer);

    const scanResult: any = await clamscan.scanStream(stream);
    if (scanResult.isInfected === undefined) {
      throw new HttpException(scanResult.data.error, HttpStatus.BAD_REQUEST);
    }

    const { isInfected, viruses } = scanResult;
    if (isInfected) {
      return {
        isInfected: isInfected,
        message: `File: ${originalname} may be infected. Viruses found: ${viruses}`,
      };
    }
    return { isInfected: isInfected, message: `File: ${originalname} is OK` };
  }

  @Post('/scanFiles')
  @UseInterceptors(AnyFilesInterceptor())
  async scanFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const clamscan = await new NodeClam().init({
      debugMode: true,
      clamdscan: {
        host: 'host.docker.internal',
        port: +process.env.CLAMAV_PORT || 3310,
      },
    });

    let scanError;
    let finalScanResults = [];
    const scanResultPromises = files.map((file) => {
      const { buffer } = file;
      const stream = Readable.from(buffer);
      return clamscan.scanStream(stream);
    });

    await Promise.all(scanResultPromises).then((scanResults) => {
      scanResults.forEach((scanResult, i) => {
        if (scanResult.isInfected === undefined) {
          scanError = scanResult;
          return;
        }

        const { isInfected, viruses } = scanResult;
        if (isInfected) {
          finalScanResults.push({
            isInfected: isInfected,
            message: `File: ${files[i].originalname} may be infected. Viruses found: ${viruses}`,
          });
          return;
        }
        finalScanResults.push({
          isInfected: isInfected,
          message: `File: ${files[i].originalname} is OK`,
        });
      });
    });

    if (scanError) {
      throw new HttpException(scanError.data.error, HttpStatus.BAD_REQUEST);
    }

    return finalScanResults;
  }
}
