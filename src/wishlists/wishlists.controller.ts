import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/types/types';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}
  @Get()
  getWishlists() {
    return this.wishlistsService.getWishlists();
  }
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishListDto: CreateWishlistDto,
    @Req() req: RequestUser,
  ) {
    return this.wishlistsService.create(req.user, createWishListDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishlistsById(@Param('id') id: string) {
    return this.wishlistsService.getWishlistsById(Number(id));
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.updateWishList(
      id,
      updateWishlistDto,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeWishlist(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.removeWishlist(id, req.user.id);
  }
}
