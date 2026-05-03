import { Module } from '@nestjs/common'
import { RidesController } from './rides.controller'

@Module({
  controllers: [RidesController],
  providers: [],
})
export class RidesModule {}
