import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { RequestUser } from 'src/types/types';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestUser) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Get('/last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('/top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlistlists(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') id: number,
    @Req() req: RequestUser,
  ) {
    return this.wishesService.updateWish(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeWish(@Param('id') id: number, @Req() req: RequestUser) {
    return this.wishesService.removeWish(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req: RequestUser) {
    return this.wishesService.copyWish(id, req.user.id);
  }
}
