import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const config = new DocumentBuilder()
    .setTitle('Ride Hailing API')
    .setDescription('Tài liệu API cho hệ thống gọi xe v1.0')
    .setVersion('1.0')
    .addTag('Auth', 'Xác thực')
    .addTag('Rides', 'Đặt xe & Chuyến đi')
    .addTag('Drivers', 'Tài xế')
    .build()

  const document = SwaggerModule.createDocument(app as any, config)
  SwaggerModule.setup('api/docs', app as any, document)

  await app.listen(3000)
  console.log(`Application is running on: http://localhost:3000/api/docs`)
}
bootstrap()
