import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from './create-task-use-case.service'
import { ListAllTaskByCreatorIdTaskUseCase } from './list-all-task-by-creator-id-use-case.service'

describe('List All Task By Creator Id Task Use Case', () => {
  let service: ListAllTaskByCreatorIdTaskUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ListAllTaskByCreatorIdTaskUseCase,
      ],
    }).compile()

    service = module.get<ListAllTaskByCreatorIdTaskUseCase>(
      ListAllTaskByCreatorIdTaskUseCase,
    )
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able to list tasks by create id', async () => {
    const creatorId = '1'
    await tasksRepository.create({
      creatorId,
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    await tasksRepository.create({
      creatorId,
      title: 'title',
      description: 'description',
      assigneeId: '3',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    const { tasks } = await service.execute({
      creatorId,
    })

    expect(tasks.length).toEqual(2)
    expect(tasks).toEqual([
      expect.objectContaining({
        assigneeId: '2',
      }),
      expect.objectContaining({
        assigneeId: '3',
      }),
    ])
  })
})
