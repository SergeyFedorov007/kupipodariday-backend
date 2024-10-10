import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => WishesModule)],
  providers: [UsersService, HashService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
