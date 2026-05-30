import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DriversController } from './drivers.controller'
import { DriversService } from './drivers.service'
import { LocationModule } from '../location/location.module'
import { RidesModule } from '../rides/rides.module'
import { JwtModule } from '@nestjs/jwt'
import { DriverProfile } from './entities/driver_profile.entity'
import { DriverDocument } from './entities/driver_document.entity'
import { Vehicle } from './entities/vehicle.entity'
import { Trip } from '../rides/entities/trip.entity'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverProfile, DriverDocument, Vehicle, Trip]),
    LocationModule,
    RidesModule,
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
