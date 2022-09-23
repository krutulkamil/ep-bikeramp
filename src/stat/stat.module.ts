import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';

@Module({
  controllers: [StatController],
  providers: [StatService]
})
export class StatModule {}
