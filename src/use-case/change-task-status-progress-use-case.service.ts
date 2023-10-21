import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TaskAlreadyDoneError } from '@/errors/task-already-done.error'
import { TaskAlreadyProgressError } from '@/errors/task-already-progress.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject, Injectable } from '@nestjs/common'

interface ChangeStatusTaskProgressUseCaseRequest {
  id: string
}

@Injectable()
export class ChangeTaskStatusProgressUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({ id }: ChangeStatusTaskProgressUseCaseRequest) {
    const task = await this.tasksRepository.findById(id)

    if (!task) {
      throw new ResourceNotFound()
    }

    if (task.status === 'DONE') {
      throw new TaskAlreadyDoneError()
    }

    if (task.status === 'PROGRESS') {
      throw new TaskAlreadyProgressError()
    }

    task.status = 'PROGRESS'
    task.startedAt = new Date()
    delete task.dependencies

    await this.tasksRepository.save(task)

    return {
      task,
    }
  }
}
