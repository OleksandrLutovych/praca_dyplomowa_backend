import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshStrategy } from './strategy/jwt.strategy';
import { UsersService } from './users/users.service';
import { PatientsModule } from '../patients/patients.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UsersModule } from './users/users.module';
import { UsersRepository } from './users/users.repository';

@Module({
  imports: [
    UsersModule,
    PatientsModule,
    DoctorsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    UsersService,
    UsersRepository,
    GoogleStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
  exports: [JwtStrategy, RefreshStrategy, PassportModule],
})
export class AuthModule {}
