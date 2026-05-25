import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
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
import { RedisService } from '../redis/redis.service'
import { CustomersService } from '../customers/customers.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private redisService: RedisService,
    private customersService: CustomersService,
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
    if (!loginDto.password) {
      throw new BadRequestException('Vui lòng nhập mật khẩu')
    }

    const user = await this.usersService.findByPhoneNumber(
      loginDto.phone_number,
    )
    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
    }

    if (!user.password_hash) {
      throw new UnauthorizedException('Tài khoản chưa được thiết lập mật khẩu')
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash)
    if (!isMatch) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
    }

    return this.generateTokens(user)
  }

  async customerForgot(phone_number: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    try {
      await this.redisService.set(`pwd_reset:${phone_number}`, otp, 600)
    } catch (e) {
      console.warn('Redis set failed for pwd_reset, continuing in dev mode', e)
    }
    // In dev env we log the OTP
    console.log(`[MOCK] Password reset OTP for ${phone_number}: ${otp}`)
    const showOtp = this.configService.get<string>('NODE_ENV') !== 'production'
    if (showOtp) return { message: 'OTP sent', otp }
    return { message: 'OTP sent' }
  }

  async updatePassword(data: {
    phone_number: string
    new_password: string
    old_password?: string
    otp_code?: string
  }) {
    const { phone_number, new_password, old_password, otp_code } = data
    const user = await this.usersService.findByPhoneNumber(phone_number)
    if (!user) throw new NotFoundException('User not found')

    // verify via otp
    if (otp_code) {
      const saved = await this.redisService.get<string>(
        `pwd_reset:${phone_number}`,
      )
      if (!saved || saved !== otp_code) {
        throw new BadRequestException('OTP không hợp lệ')
      }
    } else if (old_password) {
      const ok = await bcrypt.compare(old_password, user.password_hash || '')
      if (!ok) throw new UnauthorizedException('Mật khẩu cũ không đúng')
    } else {
      throw new BadRequestException('Cần OTP hoặc mật khẩu cũ')
    }

    const newHash = await bcrypt.hash(new_password, 10)
    await this.usersService.updateByPhoneNumber(phone_number, {
      password_hash: newHash,
    })
    return { message: 'Password updated' }
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

  async driverRegister(loginDto: LoginDto): Promise<AuthResponseDto> {
    if (!loginDto.password) {
      throw new BadRequestException('Vui lòng nhập mật khẩu')
    }

    const existingUser = await this.usersService.findByPhoneNumber(
      loginDto.phone_number,
    )

    if (existingUser) {
      throw new BadRequestException('Số điện thoại này đã được đăng ký')
    }

    const passwordHash = await bcrypt.hash(loginDto.password, 10)

    const newUser = await this.usersService.save({
      phone_number: loginDto.phone_number,
      password_hash: passwordHash,
      role: UserRole.DRIVER,
      phone_verified_at: new Date(),
    })

    return this.generateTokens(newUser)
  }

  async registerCustomer(data: {
    username: string
    email: string
    password: string
    phone_number?: string
    device_token?: string
  }): Promise<AuthResponseDto> {
    const { username, email, password, phone_number, device_token } = data
    if (!phone_number) {
      throw new BadRequestException('phone_number is required')
    }

    const existing = await this.usersService.findByPhoneNumber(phone_number)
    if (existing)
      throw new BadRequestException('Số điện thoại này đã được đăng ký')

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await this.usersService.save({
      phone_number,
      password_hash: passwordHash,
      role: UserRole.CUSTOMER,
      phone_verified_at: new Date(),
      device_token: device_token || undefined,
    })

    // create or update customer profile
    await this.customersService.updateProfile(newUser.id, {
      name: username,
      email,
    } as any)

    return this.generateTokens(newUser)
  }
}
