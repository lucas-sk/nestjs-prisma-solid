import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { hash } from 'bcryptjs'
import request from 'supertest'

export async function CreateAndAuthenticateUser(
  app: INestApplication,
  prisma: PrismaService,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example',
      password: await hash('123456', 8),
    },
  })

  const AuthResponse = await request(app.getHttpServer())
    .post('/sessions')
    .send({
      email: 'johndoe@example',
      password: '123456',
    })

  return {
    access_token: AuthResponse.body.access_token,
  }
}
