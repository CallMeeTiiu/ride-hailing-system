import { Module } from '@nestjs/common'
import { DriversController } from './drivers.controller'

@Module({
  controllers: [DriversController],
  providers: [],
})
export class DriversModule {}
