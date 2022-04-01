import 'reflect-metadata';
import { AppError } from '../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository

describe('Get balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it('should be able to get a statement operation info', async () => {
    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });
    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 100,
      description: 'test',
      type: OperationType.DEPOSIT
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    });

    expect(response).toHaveProperty('id');
    expect(response.id).toBe(statement.id);
    expect(response.user_id).toBe(user.id);
  });

  it('should not be able to get a statement operation info', async () => {
    expect.assertions(1);

    const user = await createUserUseCase.execute({
      email: 'user@test.com',
      password: '123456',
      name: 'User test',
    });

    try {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: 'test-id'
      });
    } catch(err) {
      expect(err).toBeInstanceOf(AppError)
    }
  });
});
