import { DataSource, Repository } from 'typeorm';
import { Session } from '../../../../database/entities/postgres/session.entity';
import { User } from '../../../../database/entities/postgres/user.entity';
import { EntityMapper } from './entity-mapper';
import { RepositoryAccessor } from './repository-accessor';

describe('RepositoryAccessor', () => {
  let repositoryAccessor: RepositoryAccessor;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockEntityMapper: jest.Mocked<EntityMapper>;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    // Create mock EntityMapper
    mockEntityMapper = {
      getEntityClass: jest.fn().mockReturnValue(User),
      isValidModelName: jest.fn().mockReturnValue(true),
      getAvailableModels: jest.fn().mockReturnValue(['user']),
    } as unknown as jest.Mocked<EntityMapper>;

    // Create mock DataSource
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      isInitialized: true,
    } as unknown as jest.Mocked<DataSource>;

    repositoryAccessor = new RepositoryAccessor(mockDataSource, mockEntityMapper);
  });

  describe('constructor', () => {
    it('should create instance with DataSource', () => {
      expect(repositoryAccessor).toBeInstanceOf(RepositoryAccessor);
    });

    it('should store DataSource reference', () => {
      expect(repositoryAccessor['dataSource']).toBe(mockDataSource);
    });
  });

  describe('getRepository', () => {
    it('should call DataSource.getRepository with entity class', () => {
      const result = repositoryAccessor.getRepository<User>('user');

      expect(mockEntityMapper.getEntityClass).toHaveBeenCalledWith('user');
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(result).toBe(mockRepository);
    });

    it('should return Repository instance', () => {
      const result = repositoryAccessor.getRepository<User>('user');

      expect(result).toBeDefined();
      expect(result).toBe(mockRepository);
    });

    it('should cache repository calls for same entity', () => {
      repositoryAccessor.getRepository<User>('user');
      repositoryAccessor.getRepository<User>('user');

      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(2);
    });

    it('should handle different entity classes', () => {
      class TestEntity {}
      const mockTestRepository = {} as Repository<TestEntity>;
      mockEntityMapper.getEntityClass.mockReturnValueOnce(User);
      mockEntityMapper.getEntityClass.mockReturnValueOnce(TestEntity);
      mockDataSource.getRepository.mockReturnValueOnce(mockRepository);
      mockDataSource.getRepository.mockReturnValueOnce(mockTestRepository);

      const userRepo = repositoryAccessor.getRepository<User>('user');
      const testRepo = repositoryAccessor.getRepository<Session>('session');

      expect(userRepo).toBe(mockRepository);
      expect(testRepo).toBe(mockTestRepository);
    });
  });

  describe('DataSource integration', () => {
    it('should work with initialized DataSource', () => {
      mockDataSource.initialize = jest.fn().mockResolvedValue(true);

      expect(() => repositoryAccessor.getRepository<User>('user')).not.toThrow();
    });

    it('should delegate repository creation to DataSource', () => {
      repositoryAccessor.getRepository<User>('user');

      expect(mockDataSource.getRepository).toHaveBeenCalledTimes(1);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
    });
  });

  describe('repository operations', () => {
    it('should allow CRUD operations through returned repository', async () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      const mockUser = { id: '1', email: 'test@example.com' } as User;
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const entity = repository.create({ email: 'test@example.com' });
      const saved = await repository.save(entity);

      expect(repository.create).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(saved).toBe(mockUser);
    });

    it('should support findOne operation', async () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      const mockUser = { id: '1', email: 'test@example.com' } as User;
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findOne({ where: { id: '1' } });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(mockUser);
    });

    it('should support find operation', async () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      const mockUsers = [
        { id: '1', email: 'test1@example.com' } as User,
        { id: '2', email: 'test2@example.com' } as User,
      ];
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await repository.find({ where: { role: 'user' } });

      expect(repository.find).toHaveBeenCalledWith({ where: { role: 'user' } });
      expect(result).toBe(mockUsers);
    });

    it('should support count operation', async () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      mockRepository.count.mockResolvedValue(42);

      const result = await repository.count({ where: { active: true } });

      expect(repository.count).toHaveBeenCalledWith({ where: { active: true } });
      expect(result).toBe(42);
    });

    it('should support update operation', async () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      const updateResult = { affected: 1, raw: {}, generatedMaps: [] };
      mockRepository.update.mockResolvedValue(updateResult);

      const result = await repository.update({ id: '1' }, { name: 'Updated' });

      expect(repository.update).toHaveBeenCalledWith({ id: '1' }, { name: 'Updated' });
      expect(result).toBe(updateResult);
    });

    it('should support delete operation', async () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      const deleteResult = { affected: 1, raw: {} };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await repository.delete({ id: '1' });

      expect(repository.delete).toHaveBeenCalledWith({ id: '1' });
      expect(result).toBe(deleteResult);
    });
  });

  describe('error handling', () => {
    it('should propagate DataSource errors', () => {
      mockDataSource.getRepository.mockImplementation(() => {
        throw new Error('DataSource error');
      });

      expect(() => repositoryAccessor.getRepository<User>('user')).toThrow('DataSource error');
    });

    it('should handle repository not found', () => {
      mockDataSource.getRepository.mockReturnValue(null as unknown as Repository<User>);

      const result = repositoryAccessor.getRepository<User>('user');

      expect(result).toBeNull();
    });
  });

  describe('type safety', () => {
    it('should return correctly typed repository', () => {
      const repository = repositoryAccessor.getRepository<User>('user');

      // TypeScript should infer Repository<ObjectLiteral> type
      expect(repository).toBeDefined();
    });

    it('should accept any model name', () => {
      class CustomEntity {
        id: string;
        name: string;
      }

      const mockCustomRepo = {} as Repository<CustomEntity>;
      mockEntityMapper.getEntityClass.mockReturnValue(CustomEntity);
      mockDataSource.getRepository.mockReturnValue(
        mockCustomRepo as unknown as Repository<CustomEntity>,
      );

      expect(() => repositoryAccessor.getRepository<CustomEntity>('custom')).not.toThrow();
    });
  });
});
