import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CreateUserDTO } from 'src/create-user/create-user-dto';

@Processor('sendMail-queue')
class SendMailConsumer extends WorkerHost {
  // services, provider
  constructor(private mailService: MailerService) {
    super();
  }

  async process(job: Job<CreateUserDTO>): Promise<any> {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'Code/drops <codedrops@gmail.com>',
      subject: 'welcome',
      text: `Hello ${data.name}, Your registration was successful`,
    });

    return {};
  }

  @OnQueueEvent('active')
  onActive(job: Job<CreateUserDTO>) {
    console.log(`On Active ${job.data.name}`);
  }

  @OnQueueEvent('progress')
  onProgress(job: Job<CreateUserDTO>) {
    console.log(`On Progress ${job.data.name}`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job<CreateUserDTO>) {
    console.log(`On Completed ${job.data.name}`);
  }
}

export { SendMailConsumer };
