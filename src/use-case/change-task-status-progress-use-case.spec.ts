import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TaskAlreadyDoneError } from '@/errors/task-already-done.error'
import { TaskAlreadyProgressError } from '@/errors/task-already-progress.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ChangeTaskStatusProgressUseCase } from './change-task-status-progress-use-case.service'
import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from './create-task-use-case.service'

describe('Change Task Status Progress Use Case', () => {
  let service: ChangeTaskStatusProgressUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ChangeTaskStatusProgressUseCase,
      ],
    }).compile()

    service = module.get<ChangeTaskStatusProgressUseCase>(
      ChangeTaskStatusProgressUseCase,
    )

    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able change task priority', async () => {
    const { id } = await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
    })

    const { task } = await service.execute({
      id,
    })

    expect(task.status).toEqual('PROGRESS')
  })

  it('should not be able change task status progress that is finished', async () => {
    const { id } = await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.DONE,
    })

    await expect(() =>
      service.execute({
        id,
      }),
    ).rejects.toBeInstanceOf(TaskAlreadyDoneError)
  })

  it('should not be able to finish progress that is progress', async () => {
    const { id } = await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    await expect(() =>
      service.execute({
        id,
      }),
    ).rejects.toBeInstanceOf(TaskAlreadyProgressError)
  })

  it('should not be able to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({ id: 'not-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
