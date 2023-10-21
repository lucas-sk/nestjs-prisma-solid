import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CreateAndAuthenticateUser } from 'test/create-authenticate-user'

describe('List All Task by Assignee Id (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /tasks/', async () => {
    const { access_token } = await CreateAndAuthenticateUser(app, prisma)

    const createUser = await request(app.getHttpServer()).post('/users').send({
      name: 'string',
      email: 'string',
      password: 'string',
    })

    await request(app.getHttpServer())
      .post('/tasks')
      .auth(access_token, { type: 'bearer' })
      .send({
        title: 'string',
        description: 'string',
        assigneeId: createUser.body.user.id,
        type: 'BUG',
        status: 'PROGRESS',
      })

    const accessToken = await await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: createUser.body.user.email,
        password: 'string',
      })

    const response = await request(app.getHttpServer())
      .get('/tasks/assignee')
      .auth(accessToken.body.access_token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body.tasks).toHaveLength(1)
  })
})
