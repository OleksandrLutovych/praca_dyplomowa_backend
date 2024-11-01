import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DoctorsModule,
    PatientsModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
