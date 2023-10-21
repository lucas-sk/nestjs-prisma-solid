import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from './create-task-use-case.service'
import { ListAllTaskByAssigneeIdTaskUseCase } from './list-all-task-by-assignee-id-use-case.service'

describe('List All Task By Assignee Id Task Use Case', () => {
  let service: ListAllTaskByAssigneeIdTaskUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        ListAllTaskByAssigneeIdTaskUseCase,
      ],
    }).compile()

    service = module.get<ListAllTaskByAssigneeIdTaskUseCase>(
      ListAllTaskByAssigneeIdTaskUseCase,
    )
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able to list tasks by create id', async () => {
    const assigneeId = '1'
    await tasksRepository.create({
      assigneeId,
      title: 'title',
      description: 'description',
      creatorId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    await tasksRepository.create({
      assigneeId,
      title: 'title',
      description: 'description',
      creatorId: '3',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    const { tasks } = await service.execute({
      assigneeId,
    })

    expect(tasks.length).toEqual(2)
    expect(tasks).toEqual([
      expect.objectContaining({
        creatorId: '2',
      }),
      expect.objectContaining({
        creatorId: '3',
      }),
    ])
  })
})
