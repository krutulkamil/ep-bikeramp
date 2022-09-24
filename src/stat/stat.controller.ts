import { Controller, Get } from '@nestjs/common';
import { StatService } from './stat.service';
import { IMonthlyStats, IWeeklyStats } from '../types/stat.interface';

@Controller('stats')
export class StatController {
  constructor(
      private readonly statService: StatService,
  ) {}

  @Get('weekly')
  async getWeeklyStats(): Promise<IWeeklyStats> {
    return await this.statService.getWeeklyStats();
  };

  @Get('monthly')
  async getMonthlyStats(): Promise<IMonthlyStats[]> {
    return await this.statService.getMonthlyStats();
  };
}
