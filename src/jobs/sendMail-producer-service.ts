import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CreateUserDTO } from 'src/create-user/create-user-dto';

@Injectable()
class SendMailProducerService {
  // services, provider
  constructor(@InjectQueue('sendMail-queue') private mailQueue: Queue) {}

  async sendMail(createUserDTO: CreateUserDTO) {
    await this.mailQueue.add('sendMail-job', createUserDTO);
  }
}

export { SendMailProducerService };
