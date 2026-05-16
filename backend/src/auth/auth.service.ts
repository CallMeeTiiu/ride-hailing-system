import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { UserRole } from '../common/enums'
import { AuthResponseDto } from './dto/auth-response.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RefreshToken } from './entities/refresh-token.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async generateTokens(user: any): Promise<AuthResponseDto> {
    const payload = { sub: user.id, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    // Tạo Refresh Token đơn giản
    const refreshTokenStr = require('crypto').randomBytes(40).toString('hex')
    const hashedRefreshToken = await bcrypt.hash(refreshTokenStr, 10)

    const expiresInDays = parseInt(
      this.configService
        .get<string>('JWT_REFRESH_EXPIRES_IN', '7d')
        .replace('d', ''),
    )
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    await this.refreshTokenRepo.save({
      user_id: user.id,
      token_hash: hashedRefreshToken,
      expires_at: expiresAt,
    })

    await this.usersService.updateLastLogin(user.id)

    return {
      access_token: accessToken,
      refresh_token: refreshTokenStr,
      user: {
        id: user.id,
        role: user.role,
        phone_number: user.phone_number,
      },
    }
  }

  async customerLogin(loginDto: LoginDto) {
    // Giả lập gửi OTP
    console.log(`[MOCK] OTP sent to: ${loginDto.phone_number}. OTP is 123456`)
    return { message: 'OTP sent to ' + loginDto.phone_number }
  }

  async customerVerify(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    // Giả lập check OTP
    if (verifyOtpDto.otp_code !== '123456') {
      throw new BadRequestException('Mã OTP không hợp lệ')
    }

    let user = await this.usersService.findByPhoneNumber(
      verifyOtpDto.phone_number,
    )
    if (!user) {
      // Đăng ký mới nếu chưa có
      user = await this.usersService.save({
        phone_number: verifyOtpDto.phone_number,
        role: UserRole.CUSTOMER,
        phone_verified_at: new Date(),
      })
    }

    if (user.role !== UserRole.CUSTOMER) {
      throw new UnauthorizedException('Tài khoản này không phải là khách hàng')
    }

    return this.generateTokens(user)
  }

  async driverLogin(loginDto: LoginDto): Promise<AuthResponseDto> {
    if (!loginDto.password) {
      throw new BadRequestException('Vui lòng nhập mật khẩu')
    }

    const user = await this.usersService.findByPhoneNumber(
      loginDto.phone_number,
    )

    // Trong thực tế sẽ dùng bcrypt.compare(), đây là giả lập nếu chưa có pass trong DB
    if (!user || user.role !== UserRole.DRIVER) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
    }

    if (!user.password_hash) {
      throw new UnauthorizedException(
        'Tài khoản tài xế chưa được thiết lập mật khẩu',
      )
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash)
    if (!isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
    }

    return this.generateTokens(user)
  }
}
