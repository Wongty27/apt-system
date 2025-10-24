import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { SendEmailDto } from './dtos/send-email.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KYSELY_TOKEN } from 'src/database/database.module';
import { Kysely, sql } from 'kysely';
import { DB } from 'src/database/database';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(KYSELY_TOKEN)
    private readonly db: Kysely<DB>,
  ) {}

  async sendMail(dto: SendEmailDto) {
    try {
      await this.mailerService.sendMail({
        from: dto.from,
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendAppointmentReminder(hospitalName: string) {
    try {
      const query = sql<string>`
      SELECT apmt.patient_id, pt.email, apmt.apmt_time, apmt.hospital_name
      FROM ${hospitalName}.appointments apmt
      JOIN ${hospitalName}.patients pt ON apmt.patient_id = pt.id
      WHERE (apmt.apmt_time - NOW()) <= INTERVAL '1 day'
      `;

      const appointments = await query.execute(this.db);

      // for (const appointment of appointments.rows) {
      //   const { patient_id, email, apmt_time, hospital_name } = appointment;
      //   const subject = 'Appointment Reminder';
      //   const text = `You have an appointment with ${hospital_name} on ${apmt_time}`;

      //   await this.mailerService.sendMail({
      //     to: email as string,
      //     subject,
      //     text,
      //   });
      // }
    } catch (error) {
      console.error(error);
    }
  }
}
