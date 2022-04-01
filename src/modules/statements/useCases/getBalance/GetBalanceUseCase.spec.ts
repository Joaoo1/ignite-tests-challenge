import 'reflect-metadata';
import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository

describe('Get balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to get balance of an user', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id!
    });

    expect(response).toHaveProperty('balance');
  });

  it('should not be able to get balance of an unexistent user', async () => {
    expect.assertions(1);

    try {
      await getBalanceUseCase.execute({
        user_id: 'balance-test-id'!
      });
    } catch(err) {
      expect(err).toBeInstanceOf(AppError)
    }
  });
});
