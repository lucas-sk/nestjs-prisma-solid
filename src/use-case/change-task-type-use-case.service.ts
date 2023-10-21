import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject } from '@nestjs/common'
import { TaskType } from './create-task-use-case.service'

interface ChangeTaskTypeUseCaseRequest {
  id: string
  type: TaskType
}

export class ChangeTaskTypeUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ id, type }: ChangeTaskTypeUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    task.type = type
    delete task.dependencies

    await this.tasksRepository.save(task)

    return {
      task,
    }
  }
}
