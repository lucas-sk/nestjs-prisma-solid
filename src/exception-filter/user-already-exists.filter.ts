import { UserAlreadyExistsError } from '@/errors/user-already-exists.error'
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch(UserAlreadyExistsError)
export class UserAlreadyExistsExceptionFilter extends BaseExceptionFilter {
  catch(exception: UserAlreadyExistsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    return response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: exception.message,
    })
  }
}
