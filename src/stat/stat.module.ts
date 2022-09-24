import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { DateModule } from '../utils/date/date.module';

@Module({
  imports: [
      DateModule
  ],
  controllers: [StatController],
  providers: [StatService]
})
export class StatModule {}
