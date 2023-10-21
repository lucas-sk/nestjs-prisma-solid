import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'
import { ListUniqueTaskUseCase } from './list-unique-task-use-case.service'

describe('List Unique Task Use Case', () => {
  let service: ListUniqueTaskUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ListUniqueTaskUseCase,
      ],
    }).compile()

    service = module.get<ListUniqueTaskUseCase>(ListUniqueTaskUseCase)
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to list a unique task', async () => {
    const { id } = await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskType.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    const { task } = await service.execute({
      id,
    })

    expect(task.id).toEqual(expect.any(String))
  })

  it('should not be ablet to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({ id: 'not-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
