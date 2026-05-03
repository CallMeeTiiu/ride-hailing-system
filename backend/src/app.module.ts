import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { RidesModule } from './rides/rides.module'
import { DriversModule } from './drivers/drivers.module'

@Module({
  imports: [AuthModule, RidesModule, DriversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
