import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}
  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishListsRepository.findOne(query);
  }
  async findMany(query: FindManyOptions<Wishlist>) {
    return this.wishListsRepository.find(query);
  }
  async getWishlists() {
    const wishlists = await this.findMany({
      relations: {
        owner: true,
        items: true,
      },
    });
    wishlists.forEach((wishList) => {
      delete wishList.owner.email;
      delete wishList.owner.password;
    });

    return wishlists;
  }

  async create(owner: User, createWishListDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findMany({});
    const items = createWishListDto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });

    delete owner.password;
    delete owner.email;

    const wishList = await this.wishListsRepository.create({
      ...createWishListDto,
      owner: owner,
      items: items,
    });

    return this.wishListsRepository.save(wishList);
  }

  async getWishlistsById(id: number) {
    const wishList = await this.wishListsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
    if (!wishList) {
      throw new BadRequestException('Коллекция не найдена');
    }
    wishList.items.forEach((item) => {
      if (item.offers) {
        const amounts = item.offers.map((offer) => Number(offer.amount));
        item.raised = amounts.reduce(function (acc, val) {
          return acc + val;
        }, 0);
      } else {
        item.raised = 0;
      }
    });

    delete wishList.owner.email;
    delete wishList.owner.password;

    return wishList;
  }
  async updateWishList(
    idWishList: number,
    updateWishlistDto: UpdateWishlistDto,
    idUser: number,
  ) {
    const wishList = await this.findOne({
      where: { id: idWishList },
      relations: {
        owner: true,
        items: true,
      },
    });
    console.log(wishList);

    if (!wishList) {
      throw new BadRequestException('Коллекция не найдена');
    }
    if (wishList.owner.id !== idUser) {
      throw new ForbiddenException('Нельзя редактировать чужие коллекции');
    }
    await this.wishListsRepository.update(idWishList, updateWishlistDto);
    const updatedWishList = await this.findOne({
      where: { id: idWishList },
      relations: {
        owner: true,
        items: true,
      },
    });
    delete updatedWishList.owner.email;
    delete updatedWishList.owner.password;
    return updatedWishList;
  }

  async removeWishlist(id: number, idUser: number) {
    const wishList = await this.wishListsRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishList) {
      throw new BadRequestException('Коллекция не найдена');
    }
    if (wishList.owner.id !== idUser) {
      throw new ForbiddenException('Нельзя удалять чужие коллекции');
    }
    await this.wishListsRepository.delete(id);
    return wishList;
  }
}
