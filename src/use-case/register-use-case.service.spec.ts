import { UserAlreadyExistsError } from '@/errors/user-already-exists.error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register-use-case.service'

describe('RegisterUseCaseService', () => {
  let service: RegisterUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryUsersRepository,
        {
          provide: 'UsersRepository',
          useExisting: InMemoryUsersRepository,
        },
        RegisterUseCase,
      ],
    }).compile()

    service = module.get<RegisterUseCase>(RegisterUseCase)
  })

  it('should to register', async () => {
    const { user } = await service.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await service.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await service.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() =>
      service.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
