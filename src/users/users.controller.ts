import {
  Controller,
  Header,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-user.dto';
import { RequestUser } from 'src/types/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getUser(@Req() req: RequestUser) {
    return this.usersService.findOne({ where: { id: req.user.id } });
  }

  @Get('me/wishes')
  getUserWishes(@Req() req) {
    return this.wishesService.find({
      where: { owner: { id: +req.user.id } },
      relations: { offers: true },
    });
  }

  @Post('find')
  @Header('Content-Type', 'application/json')
  async findUserByEmailOrUserName(@Body() findUserDto: FindUsersDto) {
    return this.usersService.findByUsernameOrEmail(findUserDto);
  }

  @Patch('me')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestUser,
  ) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    delete user.email;
    return user;
  }

  @Get(':username/wishes')
  async getUserWishesByUserName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    return this.wishesService.find({
      where: { owner: { id: user.id } },
      relations: { offers: true },
    });
  }
}
