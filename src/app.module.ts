import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { CreateUserController } from './create-user/create-user.controller';
import { SendMailProducerService } from './jobs/sendMail-producer-service';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379, // redis
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST, // Ethereal faker email
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
    BullBoardModule.forFeature({
      name: 'sendMail-queue',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
    }),
  ],
  controllers: [CreateUserController],
  providers: [SendMailProducerService, SendMailConsumer],
})
export class AppModule {}
