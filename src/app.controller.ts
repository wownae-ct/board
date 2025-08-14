import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {readFileString} from "./utils/file-util.utils";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private logger = new Logger('AppController');

  @Get()
  getResource(): string {
    this.logger.log('여기');
    return readFileString('./assets/index.html');
  }

  @Get('/api/health')
  health() {
    return { status: 'ok' };
  }

  }

