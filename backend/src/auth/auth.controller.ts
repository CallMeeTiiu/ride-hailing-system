import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { UserRole } from '../common/enums'
import { AuthService } from './auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/login')
  @ApiOperation({ summary: 'Khách hàng: Yêu cầu đăng nhập (Gửi OTP)' })
  @ApiResponse({
    status: 200,
    description: 'Đã gửi OTP hoặc mã tĩnh cho môi trường dev.',
  })
  async customerLogin(@Body() loginDto: LoginDto) {
    return this.authService.customerLogin(loginDto)
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
}
