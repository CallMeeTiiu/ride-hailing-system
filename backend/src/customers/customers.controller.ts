import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CustomersService } from './customers.service'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async list() {
    return this.customersService.findAll()
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req) {
    return this.customersService.findOneByUserId(req.user.userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  async updateMe(@Request() req, @Body() body: any) {
    return this.customersService.updateProfile(req.user.userId, body)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.customersService.findOneByUserId(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}${extname(file.originalname)}`
          cb(null, name)
        },
      }),
    }),
  )
  async uploadAvatar(@Request() req, @UploadedFile() file: any) {
    const url = `/uploads/${file.filename}`
    await this.customersService.updateProfile(req.user.userId, {
      avatar_url: url,
    } as any)
    return { avatar_url: url }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wallet')
  async wallet(@Request() req) {
    // Mock wallet for customer
    return {
      balance: 150000,
      currency: 'VND',
      transactions: [],
    }
  }
}
