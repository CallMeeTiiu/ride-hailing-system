import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RidesController } from './rides.controller'
import { TripGateway } from './trip.gateway'
import { JwtModule } from '@nestjs/jwt'
import { LocationModule } from '../location/location.module'
import { GoogleModule } from '../google/google.module'
import { Trip } from './entities/trip.entity'
import { TripLocation } from './entities/trip-location.entity'
import { Rating } from './entities/rating.entity'
import { RidesService } from './rides.service'
import { UsersModule } from '../users/users.module'
import { FirebaseModule } from '../firebase/firebase.module'
import { Payment } from '../payments/entities/payment.entity'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, TripLocation, Rating, Payment, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'super-secret-key-12345',
      }),
      inject: [ConfigService],
    }),
    LocationModule,
    GoogleModule,
    UsersModule,
    FirebaseModule,
  ],
  controllers: [RidesController],
  providers: [TripGateway, RidesService],
  exports: [RidesService, TripGateway],
})
export class RidesModule {}
