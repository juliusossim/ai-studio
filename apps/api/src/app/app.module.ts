import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';
import { MediaModule } from './media/media.module';
import { PropertyModule } from './property/property.module';
import { buildApiEnvFilePaths, validateApiEnv } from './telemetry/config/api-env.config';
import { HealthModule } from './telemetry/monitoring/health/health.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: buildApiEnvFilePaths(),
      expandVariables: true,
      isGlobal: true,
      validate: validateApiEnv,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'default',
          ttl: Number(configService.get<string>('API_RATE_LIMIT_TTL_MS') ?? '60000'),
          limit: Number(configService.get<string>('API_RATE_LIMIT_LIMIT') ?? '120'),
        },
      ],
    }),
    TelemetryModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    PropertyModule,
    EventsModule,
    FeedModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
