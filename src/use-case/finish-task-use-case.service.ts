import { ExistTaskInProgressError } from '@/errors/exist-task-in-progress.error'
import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TaskAlreadyDoneError } from '@/errors/task-already-done.error'
import {
  TaskWithDependencies,
  TasksRepository,
} from '@/repositories/tasks.repository'
import { Inject } from '@nestjs/common'
import { TaskStatus } from './create-task-use-case.service'

interface FinishTaskUseCaseRequest {
  id: string
}

export class FinishTaskUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ id }: FinishTaskUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    if (task.status === TaskStatus.DONE) {
      throw new TaskAlreadyDoneError()
    }

    if (this.isAnyDependentTaskInProgress(task)) {
      throw new ExistTaskInProgressError()
    }

    task.status = TaskStatus.DONE
    task.finishedAt = new Date()

    delete task.dependencies

    await this.tasksRepository.save({
      ...task,
    })

    return {
      task,
    }
  }

  private isAnyDependentTaskInProgress(task: TaskWithDependencies): boolean {
    return (
      task.dependencies.some(
        (dependentTask) => dependentTask.status === TaskStatus.PROGRESS,
      ) ?? false
    )
  }
}
