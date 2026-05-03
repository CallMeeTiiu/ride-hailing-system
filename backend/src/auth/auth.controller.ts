import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { UserRole } from '../common/enums'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('customer/login')
  @ApiOperation({ summary: 'Khách hàng: Yêu cầu đăng nhập (Gửi OTP)' })
  @ApiResponse({
    status: 200,
    description: 'Đã gửi OTP hoặc mã tĩnh cho môi trường dev.',
  })
  async customerLogin(@Body() loginDto: LoginDto) {
    // Skeleton implementation
    return { message: 'OTP sent to ' + loginDto.phone_number }
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
    // Skeleton implementation
    return {
      access_token: 'dummy-access-token',
      refresh_token: 'dummy-refresh-token',
      user: {
        id: '1',
        role: UserRole.CUSTOMER,
        phone_number: verifyOtpDto.phone_number,
      },
    }
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
    // Skeleton implementation
    return {
      access_token: 'dummy-access-token',
      refresh_token: 'dummy-refresh-token',
      user: {
        id: '1',
        role: UserRole.DRIVER,
        phone_number: loginDto.phone_number,
      },
    }
  }
}
