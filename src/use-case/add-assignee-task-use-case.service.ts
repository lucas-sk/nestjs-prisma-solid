import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject } from '@nestjs/common'

interface AddAssigneeTaskUseCaseRequest {
  id: string
  assigneeId: string
}

export class AddAssigneeTaskUseCase {
  constructor(
    @Inject('TasksRepository') private tasksRepository: TasksRepository,
  ) {}

  async execute({ assigneeId, id }: AddAssigneeTaskUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    task.assigneeId = assigneeId
    delete task.dependencies

    await this.tasksRepository.save(task)

    return {
      task,
    }
  }
}
