import { InvalidCredentialsError } from '@/errors/invalid-credentials.error'
import { UsersRepository } from '@/repositories/users.repository'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

@Injectable()
export class AuthenticateUseCase {
  constructor(
    @Inject('UsersRepository') private usersRepository: UsersRepository,
    private readonly jwt: JwtService,
  ) {}

  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    const isNotExistUser = !user

    if (isNotExistUser) {
      throw new InvalidCredentialsError()
    }

    if (!(await this.doesPasswordMatches(password, user.password))) {
      throw new InvalidCredentialsError()
    }

    const accessToken = await this.jwt.sign({ sub: user.id })

    return {
      access_token: accessToken,
    }
  }

  private doesPasswordMatches(password: string, hash: string) {
    return compare(password, hash)
  }
}
