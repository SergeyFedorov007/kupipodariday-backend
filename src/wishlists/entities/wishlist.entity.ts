import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { IsString, Length, IsOptional } from 'class-validator';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description?: string;

  @Column()
  @IsString()
  @IsOptional()
  image?: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
