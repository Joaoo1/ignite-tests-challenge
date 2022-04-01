import 'reflect-metadata';
import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository

describe('Create statement', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a statement', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 100,
      description: 'test',
      type: OperationType.DEPOSIT
    });

    expect(response).toHaveProperty('id');
    expect(response.user_id).toBe(user.id);
  });

  it('should not be able to create a statement to an unexistent user', async () => {
    expect.assertions(1);

    try {
      await createStatementUseCase.execute({
        user_id: 'test-id',
        amount: 100,
        description: 'test',
        type: OperationType.DEPOSIT
      });
    } catch(err) {
      expect(err).toBeInstanceOf(AppError)
    }
  });
});
