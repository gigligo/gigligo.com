import { Module } from '@nestjs/common';
import { GigService } from './gig.service';
import { GigController } from './gig.controller';

@Module({
  providers: [GigService],
  controllers: [GigController]
})
export class GigModule {}
