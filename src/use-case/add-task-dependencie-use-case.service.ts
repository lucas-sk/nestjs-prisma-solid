import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject, Injectable } from '@nestjs/common'

interface AddTaskDependencieUseCaseRequest {
  dependentTasks: string[]
  taskId: string
}

@Injectable()
export class AddTaskDependencieUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ taskId, dependentTasks }: AddTaskDependencieUseCaseRequest) {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      throw new ResourceNotFound()
    }

    const taskWithDependecie = await this.tasksRepository.addDependenciesTasks(
      taskId,
      dependentTasks,
    )

    return {
      task: taskWithDependecie,
    }
  }
}
