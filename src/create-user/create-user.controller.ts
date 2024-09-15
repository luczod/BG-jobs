import { Controller, Get } from '@nestjs/common';

@Controller('create-user')
export class CreateUserController {
  @Get('/')
  createUser() {
    return {
      msg: 'oi',
    };
  }
}
