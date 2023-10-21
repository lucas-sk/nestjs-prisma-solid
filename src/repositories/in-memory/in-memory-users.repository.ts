import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../users.repository'

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(user)

    return new Promise<User>((resolve) => {
      resolve(user)
    })
  }

  findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    return new Promise<User>((resolve) => {
      resolve(user)
    })
  }
}
