import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { UserRole } from '../common/enums'
import { AuthService } from './auth.service'
import { RegisterCustomerDto } from './dto/register-customer.dto'
import { UpdatePasswordDto } from './dto/reset-password.dto'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/login')
  @ApiOperation({ summary: 'Khách hàng: Đăng nhập bằng mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'Đã gửi OTP hoặc mã tĩnh cho môi trường dev.',
  })
  async customerLogin(@Body() loginDto: LoginDto) {
    return this.authService.customerLogin(loginDto)
  }

  @Post('customer/forgot')
  @ApiOperation({
    summary: 'Khách hàng: Quên mật khẩu (gửi OTP kích hoạt đổi mật khẩu)',
  })
  async customerForgot(@Body() body: { phone_number: string }) {
    return this.authService.customerForgot(body.phone_number)
  }

  @Post('customer/register')
  @ApiOperation({ summary: 'Khách hàng: Đăng ký tài khoản' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: AuthResponseDto,
  })
  async customerRegister(
    @Body() body: RegisterCustomerDto,
  ): Promise<AuthResponseDto> {
    return this.authService.registerCustomer(body)
  }

  @Post('customer/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Khách hàng: Xác thực OTP' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: AuthResponseDto,
  })
  async customerVerify(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<AuthResponseDto> {
    return this.authService.customerVerify(verifyOtpDto)
  }

  @Post('customer/reset')
  @ApiOperation({ summary: 'Khách hàng: Reset mật khẩu bằng OTP' })
  async customerReset(@Body() body: UpdatePasswordDto) {
    // body should contain phone_number, otp_code, new_password
    return this.authService.updatePassword({
      phone_number: body.phone_number,
      new_password: body.new_password,
      otp_code: body.otp_code,
    })
  }

  @Post('driver/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tài xế: Đăng nhập bằng Password' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: AuthResponseDto,
  })
  async driverLogin(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.driverLogin(loginDto)
  }

  @Post('driver/register')
  @ApiOperation({ summary: 'Tài xế: Đăng ký tài khoản' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: AuthResponseDto,
  })
  async driverRegister(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.driverRegister(loginDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('customer/change-password')
  @ApiOperation({ summary: 'Khách hàng: Đổi mật khẩu (có mật khẩu cũ)' })
  async changePassword(
    @Request() req,
    @Body() body: { old_password: string; new_password: string },
  ) {
    const phone = req.user?.phone_number
    if (!phone) {
      // fallback to userId -> fetch user? For now require phone present in JWT payload
      throw new Error('Missing phone number in token')
    }
    return this.authService.updatePassword({
      phone_number: phone,
      old_password: body.old_password,
      new_password: body.new_password,
    })
  }
}
