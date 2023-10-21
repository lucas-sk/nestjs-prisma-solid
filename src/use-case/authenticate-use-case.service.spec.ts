import { InvalidCredentialsError } from '@/errors/invalid-credentials.error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { JwtStrategy } from '@/strategy/jwt.stategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate-use-case.service'

describe('Authenticate Use Case', () => {
  let service: AuthenticateUseCase
  let usersRepository: InMemoryUsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
          }),
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        JwtStrategy,
        InMemoryUsersRepository,
        {
          provide: 'UsersRepository',
          useExisting: InMemoryUsersRepository,
        },
        AuthenticateUseCase,
      ],
    }).compile()

    service = module.get<AuthenticateUseCase>(AuthenticateUseCase)
    usersRepository = module.get<InMemoryUsersRepository>(
      InMemoryUsersRepository,
    )
  })

  it('should be able to authenticate and return access_token', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    const { access_token } = await service.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    console.log(access_token)

    expect(access_token).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      service.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    await expect(() =>
      service.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
