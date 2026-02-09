import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { AppModule } from './app.module';
import { sdk } from './instrumentation';
//import { initOpenTelemetry } from './instrumentation';
import { ContextInterceptor } from './common/interceptors/context.interceptor';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { DatabaseSeederService } from './database/seeds/database-seeder.service';

// Define a custom type for PathsObject
interface PathsObject {
  [path: string]: unknown;
}

//logger.info("Klebernilton");
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  if (process.env.TELEMETRY_ENABLED === 'true') {
    void sdk.start();
  }

  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    // origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const betterAuthService = app.get(AuthService);
  const betterAuthInstance = betterAuthService.instance;

  const nestDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('NestJS API Documentation')
      .setDescription('NestJS API with Better Auth and Oracle Database')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );

  // 2) OpenAPI do Better Auth (JSON)
  const authDoc =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (await betterAuthInstance.api.generateOpenAPISchema()) as OpenAPIObject; // OpenAPI 3.x
  // Dica: se quiser evitar colisões de rota, prefixe:
  const prefixedAuthPaths: PathsObject = {};
  for (const p of Object.keys(authDoc.paths ?? {})) {
    prefixedAuthPaths[`/api/auth${p}`] = (authDoc.paths as Record<string, unknown>)[p];
  }
  authDoc.paths = prefixedAuthPaths as unknown as OpenAPIObject['paths'];

  // 3) Merge básico
  const combined: OpenAPIObject = {
    ...nestDoc,
    tags: [...(nestDoc.tags ?? []), ...(authDoc.tags ?? [])],
    paths: { ...(nestDoc.paths ?? {}), ...(authDoc.paths ?? {}) },
    components: {
      ...(nestDoc.components ?? {}),
      ...authDoc.components,
      schemas: {
        ...(nestDoc.components?.schemas ?? {}),
        ...(authDoc.components?.schemas ?? {}),
      },
      securitySchemes: {
        ...(nestDoc.components?.securitySchemes ?? {}),
        ...(authDoc.components?.securitySchemes ?? {}),
      },
      parameters: {
        ...(nestDoc.components?.parameters ?? {}),
        ...(authDoc.components?.parameters ?? {}),
      },
      responses: {
        ...(nestDoc.components?.responses ?? {}),
        ...(authDoc.components?.responses ?? {}),
      },
      requestBodies: {
        ...(nestDoc.components?.requestBodies ?? {}),
        ...(authDoc.components?.requestBodies ?? {}),
      },
    },
    servers: nestDoc.servers ?? authDoc.servers ?? [],
  };

  SwaggerModule.setup('docs', app, combined);

  app.use(
    '/api/reference',
    apiReference({
      theme: 'purple',
      content: combined,
    }),
  );

  const port = process.env.PORT || 3000;

  app.useGlobalInterceptors(new ContextInterceptor());

  const transactionInterceptor = app.get(TransactionInterceptor);
  app.useGlobalInterceptors(transactionInterceptor);

  // Execute database seeder in development mode
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    const seeder = app.get(DatabaseSeederService);
    await seeder.seedDatabase();
  }

  await app.listen(port);

  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/reference`);
  console.log(`🔐 Auth endpoints: http://localhost:${port}/api/auth/*\n`);
}

void bootstrap();
