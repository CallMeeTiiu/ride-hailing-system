import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Ride Hailing API')
    .setDescription('Tài liệu API cho hệ thống gọi xe (MVP) - Khớp DB v1.0')
    .setVersion('1.0')
    .addTag('auth', 'Xác thực')
    .addTag('rides', 'Đặt xe & Chuyến đi')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api/docs', app as any, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api/docs`);
}
bootstrap();