import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject, Injectable } from '@nestjs/common'

interface ListUniqueTaskUseCaseRequest {
  id: string
}

@Injectable()
export class ListUniqueTaskUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ id }: ListUniqueTaskUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    return {
      task,
    }
  }
}
