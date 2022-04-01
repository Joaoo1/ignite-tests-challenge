import 'reflect-metadata';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    };

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate a nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with an incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'user@test.com',
        password: '123456',
        name: 'User test',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '0000',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
