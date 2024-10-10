import { IsString, Length, IsOptional, IsUrl, IsArray } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];
}
