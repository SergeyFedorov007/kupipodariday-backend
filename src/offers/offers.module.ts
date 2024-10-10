import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { WishesModule } from 'src/wishes/wishes.module';
@Module({
  imports: [TypeOrmModule.forFeature([Offer]), forwardRef(() => WishesModule)],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
