import { ExistTaskInProgressError } from '@/errors/exist-task-in-progress.error'
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch(ExistTaskInProgressError)
export class ExistTaskInProgressErrorExceptionFilter extends BaseExceptionFilter {
  catch(exception: ExistTaskInProgressError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
    })
  }
}
