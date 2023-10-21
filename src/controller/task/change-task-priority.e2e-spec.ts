import { AppModule } from '@/app.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CreateAndAuthenticateUser } from 'test/create-authenticate-user'

describe('Change Task Priority e2e', () => {
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

  test('[PATCH] /tasks/id/Priority', async () => {
    const { access_token } = await CreateAndAuthenticateUser(app, prisma)

    const responseCreateTask = await request(app.getHttpServer())
      .post('/tasks')
      .auth(access_token, { type: 'bearer' })
      .send({
        title: 'string',
        description: 'string',
        type: 'BUG',
        priority: 'HIGH',
        status: 'PROGRESS',
      })

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${responseCreateTask.body.task.id}/priority`)
      .auth(access_token, { type: 'bearer' })
      .send({
        priority: 'LOW',
      })

    expect(response.status).toBe(200)
    expect(response.body.task.priority).toEqual('LOW')
  })
})
