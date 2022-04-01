import 'reflect-metadata';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to show an user profile', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });

    const response = await showUserProfileUseCase.execute(user.id!);

    expect(response).toHaveProperty('id');
    expect(response.id).toBe(user.id);
  });

  it('should not be able to show profile of an unexistent user', async () => {
    expect.assertions(1);

    try {
      await showUserProfileUseCase.execute('test-id');
    } catch(err) {
      expect(err).toBeInstanceOf(AppError);
    }
  });
});
