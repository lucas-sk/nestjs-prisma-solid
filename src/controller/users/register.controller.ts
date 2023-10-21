import { Body, Controller, Post } from '@nestjs/common'

import { RegisterUseCase } from '@/use-case/register-use-case.service'
import { RegisterDto } from './dto/register.dto'

@Controller('users')
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post()
  register(@Body() body: RegisterDto) {
    return this.registerUseCase.execute(body)
  }
}
