import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Security Headers ──
  app.use(helmet());

  // ── Response Compression ──
  app.use(compression());

  // ── Global Validation ──
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ── Global Exception Filter ──
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── CORS ──
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:3000'];

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ── Swagger API Documentation ──
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Gigligo API')
      .setDescription('The Gigligo Platform REST API — Authentication, Gigs, Jobs, Orders, Wallet, Chat, and Admin.')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'User registration, login, and 2FA')
      .addTag('Profile', 'User profiles and public pages')
      .addTag('Gigs', 'Freelancer gig marketplace')
      .addTag('Jobs', 'Job board for employers')
      .addTag('Orders', 'Order lifecycle and escrow')
      .addTag('Wallet', 'Funds, credits, and transactions')
      .addTag('Chat', 'Real-time messaging')
      .addTag('Admin', 'Platform administration')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log('[Swagger] API docs available at /api/docs');
  }

  // ── Start ──
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`[Bootstrap] 🚀 Server running on port ${port}`);
}
bootstrap();
