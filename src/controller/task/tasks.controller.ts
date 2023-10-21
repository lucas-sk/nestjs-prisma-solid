import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { CreateTaskUseCase } from '@/use-case/create-task-use-case.service'

import { CurrentUser } from '@/decorator/CurrentUser.decorator'
import { JwtAuthGuard } from '@/guards/JwtAuth.guard'
import { UserPayload } from '@/strategy/UserPayload'
import { AddAssigneeTaskUseCase } from '@/use-case/add-assignee-task-use-case.service'
import { AddTaskDependencieUseCase } from '@/use-case/add-task-dependencie-use-case.service'

import { ChangeTaskDetailsUseCase } from '@/use-case/change-task-details-use-case.service'
import { ChangeTaskPriorityUseCase } from '@/use-case/change-task-priority-use-case.service'
import { ChangeTaskStatusProgressUseCase } from '@/use-case/change-task-status-progress-use-case.service'
import { FinishTaskUseCase } from '@/use-case/finish-task-use-case.service'
import { ListAllTaskByAssigneeIdTaskUseCase } from '@/use-case/list-all-task-by-assignee-id-use-case.service'
import { ListAllTaskByCreatorIdTaskUseCase } from '@/use-case/list-all-task-by-creator-id-use-case.service'
import { ListUniqueTaskUseCase } from '@/use-case/list-unique-task-use-case.service'
import { AddAssigneeDto } from './dto/add-assignee-task.dto'
import { addTaskDependencieDto } from './dto/add-task-dependencie.dto'

import { ChangeTaskTypeUseCase } from '@/use-case/change-task-type-use-case.service'
import { ChangeTaskDetails } from './dto/change-task-details.dto'
import { ChangeTaskPriorityDto } from './dto/change-task-priority.dto'
import { ChangeTaskTypeDto } from './dto/change-task-type.dto'
import { CreateTaskDto } from './dto/create-task.dto'

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskControllers {
  @Inject(CreateTaskUseCase)
  private readonly createTaskUseCase: CreateTaskUseCase

  @Inject(ListUniqueTaskUseCase)
  private readonly listUniqueTaskUseCase: ListUniqueTaskUseCase

  @Inject(ListAllTaskByCreatorIdTaskUseCase)
  private readonly listAllTaskByCreatorIdTaskUseCase: ListAllTaskByCreatorIdTaskUseCase

  @Inject(ListAllTaskByAssigneeIdTaskUseCase)
  private readonly listAllTaskByAssigneeIdTaskUseCase: ListAllTaskByAssigneeIdTaskUseCase

  @Inject(AddTaskDependencieUseCase)
  private readonly addTaskDependencieUsCase: AddTaskDependencieUseCase

  @Inject(AddAssigneeTaskUseCase)
  private readonly addAssigneeTaskUseCase: AddAssigneeTaskUseCase

  @Inject(FinishTaskUseCase)
  private readonly finishTaskUseCase: FinishTaskUseCase

  @Inject(ChangeTaskStatusProgressUseCase)
  private readonly changeTaskStatusProgressUseCase: ChangeTaskStatusProgressUseCase

  @Inject(ChangeTaskDetailsUseCase)
  private readonly changeTaskDetailsUseCase: ChangeTaskDetailsUseCase

  @Inject(ChangeTaskTypeUseCase)
  private readonly changeTaskTypeUseCase: ChangeTaskTypeUseCase

  @Inject(ChangeTaskPriorityUseCase)
  private readonly changeTaskPriorityUseCase: ChangeTaskPriorityUseCase

  @Post()
  register(@Body() body: CreateTaskDto, @CurrentUser() user: UserPayload) {
    return this.createTaskUseCase.execute({
      creatorId: user.sub,
      description: body.description,
      assigneeId: body.assigneeId,
      type: body.type,
      priority: body.priority,
      status: body.status,
      title: body.title,
      deadline: body.deadline,
    })
  }

  @Get('/created')
  listAllTaskByCreatorId(@CurrentUser() user: UserPayload) {
    return this.listAllTaskByCreatorIdTaskUseCase.execute({
      creatorId: user.sub,
    })
  }

  @Get('/assignee')
  listAllTaskByAssigneeId(@CurrentUser() user: UserPayload) {
    return this.listAllTaskByAssigneeIdTaskUseCase.execute({
      assigneeId: user.sub,
    })
  }

  @Get(':id')
  listUniqueTask(@Param('id') id: string) {
    return this.listUniqueTaskUseCase.execute({ id })
  }

  @Patch(':id/dependencies')
  addTaskDependencie(
    @Param('id') id: string,
    @Body() body: addTaskDependencieDto,
  ) {
    return this.addTaskDependencieUsCase.execute({
      dependentTasks: body.dependentTasks,
      taskId: id,
    })
  }

  @Patch(':id/complete')
  finishTask(@Param('id') id: string) {
    return this.finishTaskUseCase.execute({ id })
  }

  @Patch(':id/progress')
  startTask(@Param('id') id: string) {
    return this.changeTaskStatusProgressUseCase.execute({ id })
  }

  @Patch(':id/details')
  changeDetailsTask(@Param('id') id: string, @Body() body: ChangeTaskDetails) {
    return this.changeTaskDetailsUseCase.execute({
      id,
      description: body.description,
      title: body.title,
      deadline: body.deadline,
    })
  }

  @Patch(':id/type')
  changeTypeTask(@Param('id') id: string, @Body() body: ChangeTaskTypeDto) {
    return this.changeTaskTypeUseCase.execute({
      id,
      type: body.type,
    })
  }

  @Patch(':id/priority')
  changePriorityTask(
    @Param('id') id: string,
    @Body() body: ChangeTaskPriorityDto,
  ) {
    return this.changeTaskPriorityUseCase.execute({
      id,
      priority: body.priority,
    })
  }

  @Patch(':id/assignee')
  changeAssigneeTask(@Param('id') id: string, @Body() body: AddAssigneeDto) {
    return this.addAssigneeTaskUseCase.execute({
      id,
      assigneeId: body.assigneeId,
    })
  }
}
