import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { TaskControllers } from './controller/task/tasks.controller'
import { AuthenticateController } from './controller/users/authenticate.controller'
import { RegisterController } from './controller/users/register.controller'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaTasksRepository } from './repositories/prisma/prisma-tasks-repository'
import { PrismaUsersRepository } from './repositories/prisma/prisma-users.repository'
import { AuthenticateUseCase } from './use-case/authenticate-use-case.service'
import { CreateTaskUseCase } from './use-case/create-task-use-case.service'

import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.stategy'
import { AddAssigneeTaskUseCase } from './use-case/add-assignee-task-use-case.service'
import { AddTaskDependencieUseCase } from './use-case/add-task-dependencie-use-case.service'
import { ChangeTaskDetailsUseCase } from './use-case/change-task-details-use-case.service'
import { ChangeTaskPriorityUseCase } from './use-case/change-task-priority-use-case.service'
import { ChangeTaskStatusProgressUseCase } from './use-case/change-task-status-progress-use-case.service'

import { ChangeTaskTypeUseCase } from './use-case/change-task-type-use-case.service'
import { FinishTaskUseCase } from './use-case/finish-task-use-case.service'
import { ListAllTaskByAssigneeIdTaskUseCase } from './use-case/list-all-task-by-assignee-id-use-case.service'
import { ListAllTaskByCreatorIdTaskUseCase } from './use-case/list-all-task-by-creator-id-use-case.service'
import { ListUniqueTaskUseCase } from './use-case/list-unique-task-use-case.service'
import { RegisterUseCase } from './use-case/register-use-case.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          global: true,
          signOptions: {
            expiresIn: '1d',
          },
        }
      },
    }),
    PrismaModule,
  ],
  providers: [
    JwtStrategy,
    PrismaUsersRepository,
    {
      provide: 'UsersRepository',
      useExisting: PrismaUsersRepository,
    },
    PrismaTasksRepository,
    {
      provide: 'TasksRepository',
      useExisting: PrismaTasksRepository,
    },
    CreateTaskUseCase,
    AuthenticateUseCase,
    RegisterUseCase,
    ListUniqueTaskUseCase,
    ListAllTaskByCreatorIdTaskUseCase,
    ListAllTaskByAssigneeIdTaskUseCase,
    AddTaskDependencieUseCase,
    FinishTaskUseCase,
    ChangeTaskStatusProgressUseCase,
    ChangeTaskPriorityUseCase,
    ChangeTaskTypeUseCase,
    ChangeTaskDetailsUseCase,
    AddAssigneeTaskUseCase,
  ],
  controllers: [AuthenticateController, RegisterController, TaskControllers],
})
export class AppModule {}
