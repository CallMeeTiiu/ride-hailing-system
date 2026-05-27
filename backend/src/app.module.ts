import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { RidesModule } from './rides/rides.module'
import { DriversModule } from './drivers/drivers.module'
import { UsersModule } from './users/users.module'
import { RedisModule } from './redis/redis.module'
import { LocationModule } from './location/location.module'
import { GoogleModule } from './google/google.module'
import { FirebaseModule } from './firebase/firebase.module'
import { UploadsController } from './uploads/uploads.controller'
import { PaymentsModule } from './payments/payments.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Chỉ dùng ở DEV, lên Prod đổi thành false
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    RidesModule,
    DriversModule,
    PaymentsModule,
    RedisModule,
    LocationModule,
    GoogleModule,
    FirebaseModule,
  ],
  controllers: [AppController, UploadsController],
  providers: [AppService],
})
export class AppModule {}
