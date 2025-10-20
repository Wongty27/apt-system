import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppointmentModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { PatientsModule } from './modules/patients/patients.module';
import { StaffsModule } from './modules/staffs/staffs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AppointmentModule,
    AuthModule,
    DatabaseModule,
    HospitalsModule,
    PatientsModule,
    StaffsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
