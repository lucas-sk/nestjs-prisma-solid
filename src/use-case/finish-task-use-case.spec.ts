import { ResourceNotFound } from '@/errors/resource-not-found.error'
import { TaskAlreadyDoneError } from '@/errors/task-already-done.error'
import { InMemoryTasksRepository } from '@/repositories/in-memory/in-memory-tasks.repository'
import { Test, TestingModule } from '@nestjs/testing'
import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from './create-task-use-case.service'
import { FinishTaskUseCase } from './finish-task-use-case.service'

describe('Finish Task Use Case', () => {
  let service: FinishTaskUseCase
  let tasksRepository: InMemoryTasksRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryTasksRepository,
        {
          provide: 'TasksRepository',
          useExisting: InMemoryTasksRepository,
        },
        FinishTaskUseCase,
      ],
    }).compile()

    service = module.get<FinishTaskUseCase>(FinishTaskUseCase)
    tasksRepository = module.get<InMemoryTasksRepository>(
      InMemoryTasksRepository,
    )
  })

  it('should to able finish task', async () => {
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

    const { task } = await service.execute({
      id,
    })

    expect(task.id).toEqual(expect.any(String))
    expect(task.status).toEqual(TaskStatus.DONE)
  })
  it('should not be able to finish task that is finished', async () => {
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

  it('should not be able to change status for done if exist dependencie in progress', async () => {
    const id = '1'
    await tasksRepository.create({
      id,
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
    })

    await tasksRepository.create({
      creatorId: '1',
      title: 'title',
      description: 'description',
      assigneeId: '2',
      deadline: new Date(),
      type: TaskCategory.BUG,
      priority: TaskPriority.HIGH,
      status: TaskStatus.PROGRESS,
      taskId: id,
    })

    await expect(() => service.execute({ id })).rejects.toBeInstanceOf(Error)
  })

  it('should not be ablet to list a unique task if it does not exist', async () => {
    await expect(() =>
      service.execute({ id: 'not-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
