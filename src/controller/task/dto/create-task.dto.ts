import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from '@/use-case/create-task-use-case.service'

export class CreateTaskDto {
  title: string
  description: string
  creatorId: string
  assigneeId: string
  deadline: Date
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
}
