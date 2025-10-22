import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendEmailDto } from './dtos/send-email.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendEmailDto) {
    await this.mailService.sendMail(dto);
  }

  @Post('reminder')
  async sendAppointmentReminder(@Body() dto: { hospitalName: string }) {
    await this.mailService.sendAppointmentReminder(dto.hospitalName);
  }
}
