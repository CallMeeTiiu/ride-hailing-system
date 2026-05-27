import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'

@ApiTags('User Devices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users/devices')
export class DevicesController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerDevice(@Request() req, @Body() body: { device_token: string }) {
    const userId = req.user.userId
    await this.usersService.updateById(userId, {
      device_token: body.device_token,
    })
    return { message: 'Device registered' }
  }
}
