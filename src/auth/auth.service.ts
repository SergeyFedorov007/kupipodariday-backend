import { Injectable } from '@nestjs/common';
import { HashService } from '../hash/hash.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const isValidHash = await this.hashService.comparePasswords(
        password,
        user.password,
      );

      return isValidHash ? user : null;
    }
    return null;
  }
}
