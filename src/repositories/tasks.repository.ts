import { Priority, Prisma, Task, TaskStatus, TaskType } from '@prisma/client'

export interface TaskWithDependencies {
  id: string
  creatorId: string
  deadline: Date | null
  description: string
  priority: Priority
  status: TaskStatus
  title: string
  type: TaskType
  assigneeId: string
  createdAt: Date
  updatedAt: Date
  startedAt: Date | null
  finishedAt: Date | null
  taskId: string | null
  dependencies: Task[] | []
}

export abstract class TasksRepository {
  abstract create(data: Prisma.TaskUncheckedCreateInput): Promise<Task>
  abstract findById(id: string): Promise<TaskWithDependencies | null>
  abstract findById(id: string): Promise<TaskWithDependencies | null>
  abstract findByAllByCreatorId(
    creatorId: string,
  ): Promise<TaskWithDependencies[]>

  abstract findByAllByAssigneeId(
    assigneeId: string,
  ): Promise<TaskWithDependencies[]>

  abstract save(task: TaskWithDependencies): Promise<TaskWithDependencies>
  abstract addDependenciesTasks(
    id: string,
    dependentTaskId: string[],
  ): Promise<TaskWithDependencies>
}
