import { DeadlineCannotBeInThePastError } from '@/errors/deadline-cannot-be-in-the-past.error'
import { TasksRepository } from '@/repositories/tasks.repository'
import { Inject, Injectable } from '@nestjs/common'
import { add } from 'date-fns'

export enum TaskStatus {
  TODO = 'TODO',
  PROGRESS = 'PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskType {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  CHORE = 'CHORE',
  TEST = 'TEST',
}

interface CreateTaskUseCaseRequest {
  title: string
  description: string
  creatorId: string
  type: TaskType
  status?: TaskStatus
  priority?: TaskPriority
  deadline?: Date
  assigneeId?: string
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('TasksRepository')
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute({
    creatorId,
    title,
    description,
    type,
    priority,
    status,
    assigneeId,
    deadline,
  }: CreateTaskUseCaseRequest) {
    let priorityDefault
    if (type === 'BUG') {
      priorityDefault = TaskPriority.HIGH
    } else {
      priorityDefault = TaskPriority.MEDIUM
    }

    if (deadline && deadline < new Date()) {
      throw new DeadlineCannotBeInThePastError()
    }

    const task = await this.tasksRepository.create({
      creatorId,
      priority: priority ?? priorityDefault,
      status,
      title,
      type,
      assigneeId,
      description,
      deadline: deadline ?? this.nowAfterSevenDays(),
    })

    return {
      task,
    }
  }

  private nowAfterSevenDays() {
    return add(new Date(), { days: 7 })
  }
}
