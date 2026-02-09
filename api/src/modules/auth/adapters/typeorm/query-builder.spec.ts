import { QueryOptionsBuilder } from './query-builder';
import type { FindManyOperation } from './adapter-types';
import { FindOperator } from 'typeorm';
import { WhereInput } from './query-translator';

describe('QueryOptionsBuilder', () => {
  let queryBuilder: QueryOptionsBuilder;

  beforeEach(() => {
    queryBuilder = new QueryOptionsBuilder();
  });

  describe('buildFindOneOptions', () => {
    it('should build basic find options', () => {
      const where = [{ field: 'email', value: 'test@example.com' }];
      const result = queryBuilder.buildFindOneOptions(where);

      expect(result).toHaveProperty('where');
      expect(result.where).toEqual({ email: 'test@example.com' });
    });

    it('should build find options with select fields', () => {
      const where = [{ field: 'id', value: '123' }];
      const select = ['id', 'email', 'name'];
      const result = queryBuilder.buildFindOneOptions(where, select);

      expect(result).toHaveProperty('where');
      expect(result).toHaveProperty('select');
      expect(result.select).toEqual(['id', 'email', 'name']);
    });

    it('should handle empty where array', () => {
      const where: WhereInput = [];
      const result = queryBuilder.buildFindOneOptions(where);

      expect(result).toHaveProperty('where');
      expect(result.where).toEqual({});
    });

    it('should handle null where', () => {
      const result = queryBuilder.buildFindOneOptions(null);

      expect(result).toHaveProperty('where');
      expect(result.where).toEqual({});
    });

    it('should handle undefined where', () => {
      const result = queryBuilder.buildFindOneOptions(undefined);

      expect(result).toHaveProperty('where');
      expect(result.where).toEqual({});
    });

    it('should handle where with operators', () => {
      const where = [{ field: 'age', value: { $gt: 18 } }];
      const result = queryBuilder.buildFindOneOptions(where);

      expect(result.where).toHaveProperty('age');
      expect((result.where as Record<string, unknown>).age).toBeInstanceOf(FindOperator);
    });

    it('should handle already normalized where object', () => {
      const where: WhereInput = [
        { field: 'email', value: 'test@example.com' },
        { field: 'age', value: 25 },
      ];
      const result = queryBuilder.buildFindOneOptions(where);

      expect(result.where).toEqual({ email: 'test@example.com', age: 25 });
    });
  });

  describe('buildFindManyOptions', () => {
    it('should build options with where clause', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'status', value: 'active' }],
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toHaveProperty('where');
      expect(result.where).toEqual({ status: 'active' });
    });

    it('should build options with limit', () => {
      const params: FindManyOperation = {
        model: 'user',
        limit: 10,
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toHaveProperty('take');
      expect(result.take).toBe(10);
    });

    it('should build options with offset', () => {
      const params: FindManyOperation = {
        model: 'user',
        offset: 20,
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toHaveProperty('skip');
      expect(result.skip).toBe(20);
    });

    it('should build options with sortBy', () => {
      const params: FindManyOperation = {
        model: 'user',
        sortBy: { field: 'createdAt', direction: 'desc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toHaveProperty('order');
      expect(result.order).toEqual({ createdAt: 'DESC' });
    });

    it('should build options with ascending sort', () => {
      const params: FindManyOperation = {
        model: 'user',
        sortBy: { field: 'name', direction: 'asc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.order).toEqual({ name: 'ASC' });
    });

    it('should build options with all parameters', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'status', value: 'active' }],
        limit: 50,
        offset: 10,
        sortBy: { field: 'createdAt', direction: 'desc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toHaveProperty('where');
      expect(result).toHaveProperty('take');
      expect(result).toHaveProperty('skip');
      expect(result).toHaveProperty('order');
      expect(result.where).toEqual({ status: 'active' });
      expect(result.take).toBe(50);
      expect(result.skip).toBe(10);
      expect(result.order).toEqual({ createdAt: 'DESC' });
    });

    it('should build options without where clause', () => {
      const params: FindManyOperation = {
        model: 'user',
        limit: 10,
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).not.toHaveProperty('where');
      expect(result.take).toBe(10);
    });

    it('should handle empty params (only model)', () => {
      const params: FindManyOperation = {
        model: 'user',
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toEqual({});
    });

    it('should handle where with operators', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'age', value: { $gte: 18 } }],
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.where).toHaveProperty('age');
      expect((result.where as Record<string, unknown>).age).toBeInstanceOf(FindOperator);
    });

    it('should handle multiple where conditions', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [
          { field: 'status', value: 'active' },
          { field: 'role', value: 'admin' },
        ],
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.where).toEqual({ status: 'active', role: 'admin' });
    });
  });

  describe('buildWhereClause (private method)', () => {
    it('should convert where array to TypeORM format', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'email', value: 'test@example.com' }],
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.where).toEqual({ email: 'test@example.com' });
    });

    it('should handle null values', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'deletedAt', value: null }],
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.where).toHaveProperty('deletedAt');
      expect((result.where as Record<string, unknown>).deletedAt).toBeInstanceOf(FindOperator);
    });

    it('should handle complex operators', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'status', value: { $in: ['active', 'pending'] } }],
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect((result.where as Record<string, unknown>).status).toBeInstanceOf(FindOperator);
    });
  });

  describe('buildOrderClause (private method)', () => {
    it('should convert asc direction to uppercase', () => {
      const params: FindManyOperation = {
        model: 'user',
        sortBy: { field: 'name', direction: 'asc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.order).toEqual({ name: 'ASC' });
    });

    it('should convert desc direction to uppercase', () => {
      const params: FindManyOperation = {
        model: 'user',
        sortBy: { field: 'createdAt', direction: 'desc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.order).toEqual({ createdAt: 'DESC' });
    });

    it('should handle different field names', () => {
      const params: FindManyOperation = {
        model: 'user',
        sortBy: { field: 'email', direction: 'asc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.order).toEqual({ email: 'ASC' });
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical pagination query', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [{ field: 'status', value: 'active' }],
        limit: 20,
        offset: 40,
        sortBy: { field: 'createdAt', direction: 'desc' },
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result).toEqual({
        where: { status: 'active' },
        take: 20,
        skip: 40,
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle search with filters', () => {
      const params: FindManyOperation = {
        model: 'user',
        where: [
          { field: 'name', value: { $contains: 'John' } },
          { field: 'age', value: { $gte: 18 } },
        ],
        limit: 10,
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.where).toHaveProperty('name');
      expect(result.where).toHaveProperty('age');
      expect(result.take).toBe(10);
    });

    it('should handle findOne with complex where', () => {
      const where = [
        { field: 'email', value: 'test@example.com' },
        { field: 'emailVerified', value: true },
      ];
      const select = ['id', 'email', 'name'];
      const result = queryBuilder.buildFindOneOptions(where, select);

      expect(result.where).toEqual({
        email: 'test@example.com',
        emailVerified: true,
      });
      expect(result.select).toEqual(['id', 'email', 'name']);
    });
  });

  describe('edge cases', () => {
    it('should handle limit of 0', () => {
      const params: FindManyOperation = {
        model: 'user',
        limit: 0,
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.take).toBe(0);
    });

    it('should handle offset of 0', () => {
      const params: FindManyOperation = {
        model: 'user',
        offset: 0,
      };
      const result = queryBuilder.buildFindManyOptions(params);

      expect(result.skip).toBe(0);
    });

    it('should handle empty select array', () => {
      const where = [{ field: 'id', value: '123' }];
      const select: string[] = [];
      const result = queryBuilder.buildFindOneOptions(where, select);

      expect(result.select).toEqual([]);
    });

    it('should handle undefined select', () => {
      const where = [{ field: 'id', value: '123' }];
      const result = queryBuilder.buildFindOneOptions(where, undefined);

      expect(result.select).toBeUndefined();
    });
  });
});
