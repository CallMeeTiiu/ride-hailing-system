import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { SavedPlace } from './entities/saved_place.entity'
import { CustomerProfile } from './entities/customer_profile.entity'
import { AddressesService } from './addresses.service'
import { AddressesController } from './addresses.controller'
import { DevicesController } from './devices.controller'
import { CustomersService } from '../customers/customers.service'
import { CustomersController } from '../customers/customers.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User, SavedPlace, CustomerProfile])],
  providers: [UsersService, AddressesService, CustomersService],
  controllers: [AddressesController, CustomersController, DevicesController],
  exports: [UsersService, AddressesService, CustomersService],
})
export class UsersModule {}
