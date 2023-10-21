import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { AddAssigneeTaskUseCase } from './add-assignee-task-use-case.service'
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'

describe('Add Assignee Task Use Case', () => {
  let service: AddAssigneeTaskUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        AddAssigneeTaskUseCase,
      ],
    }).compile()

    service = module.get<AddAssigneeTaskUseCase>(AddAssigneeTaskUseCase)
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able add assignee task', async () => {
    const { id } = await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      deadline: new Date(),
      type: TaskType.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    const { task } = await service.execute({
      id,
      assigneeId: '2',
    })

    expect(task.id).toEqual(expect.any(String))
    expect(task.assigneeId).toEqual('2')
  })

  it('should not be ablet to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({ id: 'not-existing-id', assigneeId: '1' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
