import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [], // Add AuthService here later
})
export class AuthModule {}
