import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AddressesService } from './addresses.service'

@ApiTags('Addresses')
@Controller('users/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Body() body: any) {
    const { customer_user_id, ...payload } = body
    return this.addressesService.create(customer_user_id, payload)
  }

  @Get()
  async list(@Query('customer_user_id') customer_user_id: string) {
    if (!customer_user_id) return []
    return this.addressesService.findAllByUser(customer_user_id)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.addressesService.findById(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.addressesService.update(id, body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.addressesService.remove(id)
  }
}
