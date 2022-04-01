import 'reflect-metadata';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create an user', async () => {
    const response = await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to create an user if email already exists', async () => {
    expect.assertions(1);

    await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });

    try {
      await createUserUseCase.execute({
        email: 'user@test.com',
        password: '123456',
        name: 'Other User test',
      });
    } catch(err: any) {
      expect(err).toBeInstanceOf(AppError);
    }
  });
});
