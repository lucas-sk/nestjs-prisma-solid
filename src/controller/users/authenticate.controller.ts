import { AuthenticateUseCase } from '@/use-case/authenticate-use-case.service'
import { Body, Controller, Post } from '@nestjs/common'
import { AuthenticateDto } from './dto/authenticate.dto'

@Controller('sessions')
export class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  async authenticate(@Body() body: AuthenticateDto) {
    return this.authenticateUseCase.execute(body)
  }
}
