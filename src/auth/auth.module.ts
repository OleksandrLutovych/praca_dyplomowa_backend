import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersService } from './users/users.service';
import { PatientsModule } from '../patients/patients.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    PatientsModule,
    DoctorsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, GoogleStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
