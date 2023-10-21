import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject } from '@nestjs/common'

interface ChangeTaskDetailsUseCaseRequest {
  id: string
  title?: string | null
  description?: string | null
  deadline?: Date | null
}

export class ChangeTaskDetailsUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({
    id,
    title,
    deadline,
    description,
  }: ChangeTaskDetailsUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    if (title) {
      task.title = title
    }

    if (deadline) {
      task.deadline = deadline
    }

    if (description) {
      task.description = description
    }

    delete task.dependencies

    await this.tasksRepository.save(task)

    return {
      task,
    }
  }
}
