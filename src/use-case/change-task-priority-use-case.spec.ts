import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ChangeTaskPriorityUseCase } from './change-task-priority-use-case.service'
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'

describe('Change Task Priority Use Case', () => {
  let service: ChangeTaskPriorityUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ChangeTaskPriorityUseCase,
      ],
    }).compile()

    service = module.get<ChangeTaskPriorityUseCase>(ChangeTaskPriorityUseCase)
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
      type: TaskType.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
    })

    const { task } = await service.execute({
      id,
      priority: TaskPriority.LOW,
    })

    expect(task.priority).toEqual('LOW')
  })

  it('should not be able to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({ id: 'not-existing-id', priority: TaskPriority.LOW }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
