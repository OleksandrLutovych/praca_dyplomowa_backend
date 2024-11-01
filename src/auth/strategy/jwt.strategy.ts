import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myjwtsecret',
    });
  }

  async validate(payload) {
    const { id } = payload;

    const user = await this.userService.getUser({ id });

    if (!user) {
      throw new UnauthorizedException('Login first to access this resource');
    }

    return user;
  }
}
