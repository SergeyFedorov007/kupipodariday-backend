import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsNotEmpty,
  IsUrl,
  IsNumber,
  Min,
  Length,
  IsString,
  IsPositive,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offers.entity';

@Entity()
export class Wish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  @IsString()
  link: string;

  @Column()
  @IsUrl()
  @IsString()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNotEmpty()
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ length: 1024 })
  @IsNotEmpty()
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  copied: number;
}
