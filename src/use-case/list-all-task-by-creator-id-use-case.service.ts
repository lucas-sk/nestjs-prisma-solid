import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject, Injectable } from '@nestjs/common'

interface ListUniqueTaskUseCaseRequest {
  creatorId: string
}

@Injectable()
export class ListAllTaskByCreatorIdTaskUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ creatorId }: ListUniqueTaskUseCaseRequest) {
    const tasks = await this.tasksRepository.findByAllByCreatorId(creatorId)

    return {
      tasks,
    }
  }
}
