import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, FindManyOptions } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    delete owner.email;
    delete owner.password;
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return this.wishesRepository.save(wish);
  }

  async find(query: FindOneOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  async findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  async findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  async findLast() {
    const wishes = await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: {
        owner: true,
        offers: {
          item: true,
        },
      },
    });
    wishes.forEach((wish) => {
      const amounts = wish.offers.map((offer) => Number(offer.amount));
      wish.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);
      delete wish.owner.password;
      delete wish.owner.email;
    });
    return wishes;
  }

  async findTop() {
    const wishes = await this.wishesRepository.find({
      take: 10,
      order: { copied: 'DESC' },
      relations: {
        owner: true,
        offers: {
          item: true,
        },
      },
    });
    const copiedWishes = wishes.filter((wish) => {
      if (wish.copied === 0) {
        return;
      }
      return wish;
    });
    copiedWishes.forEach((wish) => {
      const amounts = wish.offers.map((offer) => Number(offer.amount));
      wish.raised = amounts.reduce(function (acc, val) {
        return acc + val;
      }, 0);

      delete wish.owner.password;
      delete wish.owner.email;
    });
    return copiedWishes;
  }

  async findWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: +id },
      relations: {
        owner: true,
        offers: {
          item: true,
          user: { offers: true, wishes: true, wishlists: true },
        },
      },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }
    const amounts = wish.offers.map((offer) => Number(offer.amount));
    wish.raised = amounts.reduce(function (acc, val) {
      return acc + val;
    }, 0);

    delete wish.owner.email;
    delete wish.owner.password;
    return wish;
  }

  async updateWish(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Чужие подарки редактировать нельзя');
    }
    if (wish.offers.length !== 0 && wish.raised > 0) {
      throw new ForbiddenException(
        'Нельзя изменить цену, когда есть желающие скинуться',
      );
    }
    await this.wishesRepository.update(id, updateWishDto);
    return this.wishesRepository.findOne({ where: { id } });
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Чужие подарки удалять нельзя');
    }
    await this.wishesRepository.delete(id);
    delete wish.owner.password;
    delete wish.owner.email;
    return wish;
  }

  async copyWish(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id === userId) {
      throw new ForbiddenException('Подарок уже в вашей коллекции');
    }
    const newWish = await this.wishesRepository.insert({
      ...wish,
      copied: 0,
      raised: 0,
      owner: {
        id: userId,
      },
    });
    wish.copied = +1;
    await this.wishesRepository.save(wish);
    return newWish;
  }
}
