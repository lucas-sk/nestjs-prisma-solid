import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject } from '@nestjs/common'
import { TaskPriority } from './create-task-use-case.service'

interface ChangeTaskPriorityUseCaseRequest {
  id: string
  priority: TaskPriority
}

export class ChangeTaskPriorityUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ id, priority }: ChangeTaskPriorityUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    task.priority = priority
    delete task.dependencies

    await this.tasksRepository.save(task)

    return {
      task,
    }
  }
}
