import { Priority, Prisma, Task } from '@prisma/client'
import { randomUUID } from 'crypto'
import { TaskWithDependencies, TasksRepository } from '../tasks.repository'

export class InMemoryTasksRepository implements TasksRepository {
  public items: TaskWithDependencies[] = []

  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const task = {
      id: randomUUID(),
      creatorId: data.creatorId,
      deadline: data.deadline ? new Date(data.deadline) : null,
      description: data.description,
      priority: data.priority as Priority,
      status: data.status,
      title: data.title,
      type: data.type,
      assigneeId: data.assigneeId,
      createdAt: new Date(),
      updatedAt: new Date(),
      dependencies: [],
      taskId: null,
    }

    this.items.push(task)

    return new Promise<Task>((resolve) => {
      resolve(task)
    })
  }

  findById(id: string) {
    const task = this.items.find((task) => task.id === id)

    return new Promise<TaskWithDependencies>((resolve) => {
      resolve(task)
    })
  }

  findByAllByAssigneeId(assigneeId: string) {
    const tasks = this.items.filter((task) => task.assigneeId === assigneeId)

    return new Promise<TaskWithDependencies[]>((resolve) => {
      resolve(tasks)
    })
  }

  findByAllByCreatorId(creatorId: string) {
    const tasks = this.items.filter((task) => task.creatorId === creatorId)

    return new Promise<TaskWithDependencies[]>((resolve) => {
      resolve(tasks)
    })
  }

  addDependenciesTasks(
    id: string,
    dependentTaskId: string[],
  ): Promise<TaskWithDependencies> {
    const taskDependent = this.items.map((task) => {
      if (dependentTaskId.includes(task.id)) {
        return {
          ...task,
          taskId: id,
        }
      }

      return task
    })

    this.items = taskDependent

    const task = this.items.find((task) => task.id === id)

    task.dependencies = this.items.filter((task) =>
      dependentTaskId.includes(task.id),
    ) as TaskWithDependencies[]

    return new Promise<TaskWithDependencies>((resolve) => {
      resolve(task)
    })
  }

  save(task: TaskWithDependencies): Promise<TaskWithDependencies> {
    const taskIndex = this.items.findIndex((item) => item.id === task.id)

    this.items[taskIndex] = task

    return new Promise<TaskWithDependencies>((resolve) => {
      resolve(task)
    })
  }
}
