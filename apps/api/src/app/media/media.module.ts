import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MediaController } from './media.controller';
import { MediaStorageConfigService } from './media-storage.config';
import { MediaService } from './media.service';
import { MEDIA_STORAGE_ADAPTER } from './media-storage.types';
import { S3MediaStorageAdapter } from './s3-media-storage.adapter';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [
    MediaStorageConfigService,
    MediaService,
    S3MediaStorageAdapter,
    {
      provide: MEDIA_STORAGE_ADAPTER,
      useExisting: S3MediaStorageAdapter,
    },
  ],
  exports: [MediaService],
})
export class MediaModule {}
