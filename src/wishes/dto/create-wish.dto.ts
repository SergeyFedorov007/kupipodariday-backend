import { OmitType } from '@nestjs/mapped-types';
import { Wish } from '../entities/wish.entity';

export class CreateWishDto extends OmitType(Wish, [
  'id',
  'createdAt',
  'updatedAt',
  'raised',
  'copied',
] as const) {}
