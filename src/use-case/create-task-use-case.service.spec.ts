import { DeadlineCannotBeInThePastError } from '@/errors/deadline-cannot-be-in-the-past.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { formatDistance } from 'date-fns'
import {
  CreateTaskUseCase,
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'

describe('Create Task Use Case', () => {
  let service: CreateTaskUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        CreateTaskUseCase,
      ],
    }).compile()

    service = module.get<CreateTaskUseCase>(CreateTaskUseCase)
  })

  it('should to create a new task', async () => {
    const { task } = await service.execute({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      type: TaskType.FEATURE,
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
    })

    expect(task.id).toEqual(expect.any(String))
    expect(formatDistance(task.deadline, new Date())).toEqual('7 days')
  })
  it('should to create a new task', async () => {
    await expect(() =>
      service.execute({
        creatorId: '1',
        title: 'title',
        description: 'description',
        assigneeId: '2',
        type: TaskType.FEATURE,
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        deadline: new Date('2021-01-01'),
      }),
    ).rejects.toBeInstanceOf(DeadlineCannotBeInThePastError)
  })

  it('should to create a new task with feature bug', async () => {
    const { task } = await service.execute({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskType.BUG,
      status: TaskStatus.PROGRESS,
    })

    expect(task.id).toEqual(expect.any(String))
    expect(task.priority).toEqual(TaskPriority.HIGH)
  })

  it('should to create a new task with feature category', async () => {
    const { task } = await service.execute({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskType.FEATURE,
      status: TaskStatus.PROGRESS,
    })

    expect(task.id).toEqual(expect.any(String))
    expect(task.priority).toEqual(TaskPriority.MEDIUM)
  })
})
