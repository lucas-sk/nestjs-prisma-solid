import { AppModule } from '@/app.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CreateAndAuthenticateUser } from 'test/create-authenticate-user'

describe('Change Task Details e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /tasks/id/details', async () => {
    const { access_token } = await CreateAndAuthenticateUser(app, prisma)

    const responseCreateTask = await request(app.getHttpServer())
      .post('/tasks')
      .auth(access_token, { type: 'bearer' })
      .send({
        title: 'string',
        description: 'string',
        type: 'BUG',
        status: 'PROGRESS',
      })

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${responseCreateTask.body.task.id}/details`)
      .auth(access_token, { type: 'bearer' })
      .send({
        title: 'new title',
        description: 'new description',
        deadline: '2024-09-09T00:00:00.000Z',
      })

    expect(response.status).toBe(200)
    expect(response.body.task.title).toEqual('new title')
    expect(response.body.task.description).toEqual('new description')
    expect(response.body.task.deadline).toEqual('2024-09-09T00:00:00.000Z')
  })
})
