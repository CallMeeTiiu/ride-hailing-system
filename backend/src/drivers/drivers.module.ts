import { Module } from '@nestjs/common'
import { DriversController } from './drivers.controller'
import { DriversService } from './drivers.service'
import { LocationModule } from '../location/location.module'
import { RidesModule } from '../rides/rides.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [LocationModule, RidesModule, JwtModule.register({})],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
