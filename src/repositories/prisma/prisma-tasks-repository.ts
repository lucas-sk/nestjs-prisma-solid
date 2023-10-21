import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma, Task } from '@prisma/client'
import { TasksRepository } from '../tasks.repository'

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    return this.prisma.task.create({ data })
  }

  findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        dependencies: true,
      },
    })
  }

  findByAllByCreatorId(creatorId: string) {
    return this.prisma.task.findMany({
      where: { creatorId },
      include: { dependencies: true },
    })
  }

  findByAllByAssigneeId(assigneeId: string) {
    return this.prisma.task.findMany({
      where: { assigneeId },
      include: { dependencies: true },
    })
  }

  save(task: Task) {
    return this.prisma.task.update({
      where: { id: task.id },
      data: {
        ...task,
      },
      include: {
        dependencies: true,
      },
    })
  }

  addDependenciesTasks(id: string, dependentTaskId: string[]) {
    return this.prisma.task.update({
      where: { id },
      data: {
        dependencies: {
          connect: dependentTaskId.map((taskId) => ({ id: taskId })),
        },
      },
      include: {
        dependencies: true,
      },
    })
  }
}
