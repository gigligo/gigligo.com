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
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://gigligo.com',
    'https://www.gigligo.com',
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Check explicit allowlist
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow the app's own Vercel preview domains (gigligo-*.vercel.app only)
      if (/^https:\/\/gigligo(-[a-z0-9]+)?\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
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
  await app.listen(port, '0.0.0.0');
  console.log(`[Bootstrap] 🚀 Server running on port ${port}`);
}
bootstrap();
