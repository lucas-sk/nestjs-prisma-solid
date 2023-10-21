import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'

import { AddTaskDependencieUseCase } from './add-task-dependencie-use-case.service'
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from './create-task-use-case.service'

describe('Add Task Dependencie Use Case', () => {
  let service: AddTaskDependencieUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        AddTaskDependencieUseCase,
      ],
    }).compile()

    service = module.get<AddTaskDependencieUseCase>(AddTaskDependencieUseCase)
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able to add task with dependency on other task', async () => {
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

    const taskDependent = await tasksRepository.create({
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
      taskId: id,
      dependentTasks: [taskDependent.id],
    })

    expect(task.dependencies).toHaveLength(1)
    expect(task.dependencies[0].taskId).toEqual(id)
  })
})
