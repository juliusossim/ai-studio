import { IsUUID } from 'class-validator';

export class MediaUploadIdParamDto {
  @IsUUID()
  id!: string;
}
