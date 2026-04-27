import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { Property, PropertyInteractionResponse } from '@org/types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UuidParamDto } from '../common/dto/uuid-param.dto';
import type { CreatePropertyDto } from './dto/create-property.dto';
import type * as propertyInteractionDto from './dto/property-interaction.dto';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() input: CreatePropertyDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Property> {
    return this.propertyService.create(input, user.id);
  }

  @Get()
  findMany(): Promise<Property[]> {
    return this.propertyService.findMany();
  }

  @Get(':id')
  findById(@Param() params: UuidParamDto): Promise<Property> {
    return this.propertyService.findById(params.id);
  }

  @Post(':id/view')
  view(
    @Param() params: UuidParamDto,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(params.id, input, 'view_property');
  }

  @Post(':id/like')
  like(
    @Param() params: UuidParamDto,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(params.id, input, 'like_property');
  }

  @Post(':id/save')
  save(
    @Param() params: UuidParamDto,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(params.id, input, 'save_property');
  }

  @Post(':id/share')
  share(
    @Param() params: UuidParamDto,
    @Body() input: propertyInteractionDto.PropertyInteractionDto,
  ): Promise<PropertyInteractionResponse> {
    return this.propertyService.trackInteraction(params.id, input, 'share_property');
  }
}
