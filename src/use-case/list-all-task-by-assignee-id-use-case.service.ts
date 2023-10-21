import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject, Injectable } from '@nestjs/common'

interface ListAllTaskByAssigneeIdTaskUseCaseRequest {
  assigneeId: string
}

@Injectable()
export class ListAllTaskByAssigneeIdTaskUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ assigneeId }: ListAllTaskByAssigneeIdTaskUseCaseRequest) {
    const tasks = await this.tasksRepository.findByAllByAssigneeId(assigneeId)
    return {
      tasks,
    }
  }
}
