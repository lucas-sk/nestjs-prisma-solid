import { TaskType } from '@/use-case/create-task-use-case.service'
import { IsEnum } from 'class-validator'

export class ChangeTaskTypeDto {
  @IsEnum(TaskType)
  type: TaskType
}
