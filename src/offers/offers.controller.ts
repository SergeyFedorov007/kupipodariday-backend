import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/types/types';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Req() req: RequestUser, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  getOffers() {
    return this.offersService.getOffers();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.offersService.getById(Number(id));
  }
}
