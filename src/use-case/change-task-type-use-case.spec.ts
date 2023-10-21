import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ChangeTaskTypeUseCase } from './change-task-type-use-case.service'
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'

describe('Change Task Type Use Case', () => {
  let service: ChangeTaskTypeUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ChangeTaskTypeUseCase,
      ],
    }).compile()

    service = module.get<ChangeTaskTypeUseCase>(ChangeTaskTypeUseCase)
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able change task type', async () => {
    const { id } = await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskType.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
    })

    const { task } = await service.execute({
      id,
      type: TaskType.FEATURE,
    })

    expect(task.type).toEqual('FEATURE')
  })

  it('should not be able to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({
        id: 'not-existing-id',
        type: TaskType.FEATURE,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
