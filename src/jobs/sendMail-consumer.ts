import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueEvent, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
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

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`On Active ${job.name}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`On Progress ${job.name}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }
}

export { SendMailConsumer };
