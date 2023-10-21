import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ChangeTaskDetailsUseCase } from './change-task-details-use-case.service'
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'

describe('Change Task Details Use Case', () => {
  let service: ChangeTaskDetailsUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ChangeTaskDetailsUseCase,
      ],
    }).compile()

    service = module.get<ChangeTaskDetailsUseCase>(ChangeTaskDetailsUseCase)
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able change task details', async () => {
    const taskUpdate = {
      description: 'new description',
      title: 'title',
      deadline: new Date(),
    }

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
      description: taskUpdate.description,
      title: taskUpdate.title,
      deadline: taskUpdate.deadline,
    })

    expect(task.title).toEqual(task.title)
    expect(task.description).toEqual(task.description)
    expect(task.deadline).toEqual(task.deadline)
  })

  it('should not be able to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({
        id: 'not-existing-id',
        description: 'new description',
        title: 'new title',
        deadline: new Date(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
