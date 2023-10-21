import { UserAlreadyExistsError } from '@/errors/user-already-exists.error'
import { UsersRepository } from '@/repositories/users.repository'
import { Inject, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (user) {
      throw new UserAlreadyExistsError()
    }

    const CreatedUser = await this.usersRepository.create({
      name,
      email,
      password: await this.hashPassword(password),
    })

    return {
      user: CreatedUser,
    }
  }

  private hashPassword(password: string) {
    return hash(password, 8)
  }
}
