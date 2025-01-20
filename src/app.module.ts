import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { DoctorProfileModule } from './personal-space/doctor/profile/doctor-profile.module';
import { DoctorServicesModule } from './doctor-services/doctor-services.module';
import { AuthGuard } from './auth/guards/auth-auth.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PatientProfileModule } from './personal-space/patient/profile/patient-profile.module';
import { DoctorCalendarModule } from './personal-space/doctor/calendar/doctor-calendar.module';
import { DoctorConsultsModule } from './personal-space/doctor/consults/doctor-consults.module';
import { DoctorScheduleModule } from './personal-space/doctor/schedule/doctor-schedule.module';
import { PatientPersonalVisitsModule } from './personal-space/patient/visits/patient-personal-visits.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UsersModule,
    DoctorsModule,
    PatientsModule,
    DoctorScheduleModule,
    DoctorProfileModule,
    PatientProfileModule,
    DoctorServicesModule,
    DoctorCalendarModule,
    DoctorConsultsModule,
    PatientPersonalVisitsModule,
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
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    JwtStrategy,
    JwtService,
  ],
})
export class AppModule {}
