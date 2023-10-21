import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { InvalidCredentialsExceptionFilter } from './exception-filter/Invalid-credentials-exception.filter'
import { ExistTaskInProgressErrorExceptionFilter } from './exception-filter/exist-task-in-progress-exception.filter'
import { PrismaExceptionFilter } from './exception-filter/prisma-exception.filter'
import { UserAlreadyExistsExceptionFilter } from './exception-filter/user-already-exists.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  )

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new UserAlreadyExistsExceptionFilter(),
    new InvalidCredentialsExceptionFilter(),
    new ExistTaskInProgressErrorExceptionFilter(),
  )

  const port = configService.get('PORT')
  await app.listen(port)
}
bootstrap()
