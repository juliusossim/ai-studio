import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type {
  AbortMediaUploadResponse,
  InitiateMediaUploadResponse,
  UploadedMediaAsset,
} from '@org/types';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { InitiateMediaUploadDto } from './dto/initiate-media-upload.dto';
import { MediaUploadIdParamDto } from './dto/media-upload-id-param.dto';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(AuthGuard)
@Throttle({ default: { limit: 60, ttl: 10 * 60_000 } })
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('uploads/initiate')
  initiateUpload(
    @Body() input: InitiateMediaUploadDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<InitiateMediaUploadResponse> {
    return this.mediaService.initiateUpload(input, readAuthenticatedUserId(request));
  }

  @Post('uploads/:id/complete')
  completeUpload(
    @Param() params: MediaUploadIdParamDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<UploadedMediaAsset> {
    return this.mediaService.completeUpload(params.id, readAuthenticatedUserId(request));
  }

  @Post('uploads/:id/abort')
  abortUpload(
    @Param() params: MediaUploadIdParamDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<AbortMediaUploadResponse> {
    return this.mediaService.abortUpload(params.id, readAuthenticatedUserId(request));
  }
}

function readAuthenticatedUserId(request: AuthenticatedRequest): string {
  if (!request.user?.id) {
    throw new UnauthorizedException('Missing authenticated user context.');
  }

  return request.user.id;
}
