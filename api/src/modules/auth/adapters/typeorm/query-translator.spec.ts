import { normalizeWhereClause, convertToTypeORMWhere, type WhereInput } from './query-translator';
import { Equal, FindOperator } from 'typeorm';

describe('Query Translator', () => {
  describe('normalizeWhereClause', () => {
    describe('array with field/value objects', () => {
      it('should normalize single field/value object in array', () => {
        const input: WhereInput = [{ field: 'email', value: 'test@example.com' }];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ email: 'test@example.com' });
      });

      it('should normalize multiple field/value objects in array', () => {
        const input: WhereInput = [
          { field: 'email', value: 'test@example.com' },
          { field: 'name', value: 'John Doe' },
        ];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({
          email: 'test@example.com',
          name: 'John Doe',
        });
      });

      it('should handle field/value objects with operator', () => {
        const input: WhereInput = [{ field: 'age', value: 18, operator: 'gt' }];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ age: 18 });
      });

      it('should handle field/value objects with connector', () => {
        const input: WhereInput = [{ field: 'email', value: 'test@example.com', connector: 'AND' }];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ email: 'test@example.com' });
      });
    });

    describe('array with standard objects', () => {
      it('should normalize array with standard object', () => {
        const input: WhereInput = [{ field: 'email', value: 'test@example.com' }];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ email: 'test@example.com' });
      });

      it('should merge multiple standard objects', () => {
        const input: WhereInput = [
          { field: 'email', value: 'test@example.com' },
          { field: 'name', value: 'John' },
        ];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({
          email: 'test@example.com',
          name: 'John',
        });
      });
    });

    describe('single field/value object', () => {
      it('should normalize single field/value object', () => {
        const input: WhereInput = { field: 'email', value: 'test@example.com' };
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ email: 'test@example.com' });
      });
    });

    describe('already normalized objects', () => {
      it('should pass through already normalized object', () => {
        const input: WhereInput = { email: 'test@example.com', age: 25 };
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ email: 'test@example.com', age: 25 });
      });

      it('should handle objects with nested operators', () => {
        const input: WhereInput = { age: { $gt: 18 } };
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ age: { $gt: 18 } });
      });
    });

    describe('edge cases', () => {
      it('should return empty object for null', () => {
        const result = normalizeWhereClause(null);
        expect(result).toEqual({});
      });

      it('should return empty object for undefined', () => {
        const result = normalizeWhereClause(undefined);
        expect(result).toEqual({});
      });

      it('should return empty object for empty array', () => {
        const result = normalizeWhereClause([]);
        expect(result).toEqual({});
      });

      it('should handle array with null/undefined elements', () => {
        const input: WhereInput = [
          null,
          undefined,
          { field: 'email', value: 'test@example.com' },
        ] as WhereInput;
        const result = normalizeWhereClause(input);
        expect(result).toEqual({ email: 'test@example.com' });
      });
    });

    describe('mixed formats', () => {
      it('should handle mixed field/value and standard objects', () => {
        const input: WhereInput = [
          { field: 'email', value: 'test@example.com' },
          { field: 'name', value: 'John' },
        ];
        const result = normalizeWhereClause(input);
        expect(result).toEqual({
          email: 'test@example.com',
          name: 'John',
        });
      });
    });
  });

  describe('convertToTypeORMWhere', () => {
    describe('simple equality', () => {
      it('should handle simple string value', () => {
        const input = { email: 'test@example.com' };
        const result = convertToTypeORMWhere(input);
        expect(result).toEqual({ email: 'test@example.com' });
      });

      it('should handle multiple fields', () => {
        const input = { email: 'test@example.com', name: 'John' };
        const result = convertToTypeORMWhere(input);
        expect(result).toEqual({ email: 'test@example.com', name: 'John' });
      });

      it('should handle number values', () => {
        const input = { age: 25 };
        const result = convertToTypeORMWhere(input);
        expect(result).toEqual({ age: 25 });
      });

      it('should handle boolean values', () => {
        const input = { active: true };
        const result = convertToTypeORMWhere(input);
        expect(result).toEqual({ active: true });
      });
    });

    describe('null handling', () => {
      it('should convert null to IsNull()', () => {
        const input = { deletedAt: null };
        const result = convertToTypeORMWhere(input);
        expect(result.deletedAt).toBeInstanceOf(FindOperator);
      });

      it('should skip undefined values', () => {
        const input = { email: 'test@example.com', undefinedField: undefined };
        const result = convertToTypeORMWhere(input);
        expect(result).toEqual({ email: 'test@example.com' });
        expect(result).not.toHaveProperty('undefinedField');
      });
    });

    describe('comparison operators', () => {
      it('should convert $eq operator', () => {
        const input = { age: { $eq: 25 } };
        const result = convertToTypeORMWhere(input);
        expect(result.age).toBeInstanceOf(FindOperator);
        expect((result.age as FindOperator<number>)['_type']).toBe('equal');
      });

      it('should convert $ne operator', () => {
        const input = { status: { $ne: 'deleted' } };
        const result = convertToTypeORMWhere(input);
        expect(result.status).toBeInstanceOf(FindOperator);
        expect((result.status as FindOperator<string>)['_type']).toBe('not');
      });

      it('should convert $gt operator', () => {
        const input = { age: { $gt: 18 } };
        const result = convertToTypeORMWhere(input);
        expect(result.age).toBeInstanceOf(FindOperator);
        expect((result.age as FindOperator<number>)['_type']).toBe('moreThan');
      });

      it('should convert $gte operator', () => {
        const input = { age: { $gte: 18 } };
        const result = convertToTypeORMWhere(input);
        expect(result.age).toBeInstanceOf(FindOperator);
        expect((result.age as FindOperator<number>)['_type']).toBe('moreThanOrEqual');
      });

      it('should convert $lt operator', () => {
        const input = { age: { $lt: 65 } };
        const result = convertToTypeORMWhere(input);
        expect(result.age).toBeInstanceOf(FindOperator);
        expect((result.age as FindOperator<number>)['_type']).toBe('lessThan');
      });

      it('should convert $lte operator', () => {
        const input = { age: { $lte: 65 } };
        const result = convertToTypeORMWhere(input);
        expect(result.age).toBeInstanceOf(FindOperator);
        expect((result.age as FindOperator<number>)['_type']).toBe('lessThanOrEqual');
      });
    });

    describe('array operators', () => {
      it('should convert $in operator', () => {
        const input = { status: { $in: ['active', 'pending'] } };
        const result = convertToTypeORMWhere(input);
        expect(result.status).toBeInstanceOf(FindOperator);
        expect((result.status as FindOperator<string[]>)['_type']).toBe('in');
      });

      it('should convert $nin operator', () => {
        const input = { status: { $nin: ['deleted', 'archived'] } };
        const result = convertToTypeORMWhere(input);
        expect(result.status).toBeInstanceOf(FindOperator);
        expect((result.status as FindOperator<string[]>)['_type']).toBe('not');
      });

      it('should handle $in with single value', () => {
        const input = { status: { $in: ['active'] } };
        const result = convertToTypeORMWhere(input);
        expect(result.status).toBeInstanceOf(FindOperator);
      });
    });

    describe('pattern matching operators', () => {
      it('should convert $like operator', () => {
        const input = { name: { $like: '%John%' } };
        const result = convertToTypeORMWhere(input);
        expect(result.name).toBeInstanceOf(FindOperator);
        expect((result.name as FindOperator<string>)['_type']).toBe('like');
      });

      it('should convert $ilike operator', () => {
        const input = { name: { $ilike: '%john%' } };
        const result = convertToTypeORMWhere(input);
        expect(result.name).toBeInstanceOf(FindOperator);
        expect((result.name as FindOperator<string>)['_type']).toBe('ilike');
      });

      it('should convert $startsWith operator', () => {
        const input = { name: { $startsWith: 'John' } };
        const result = convertToTypeORMWhere(input);
        expect(result.name).toBeInstanceOf(FindOperator);
        expect((result.name as FindOperator<string>)['_type']).toBe('like');
      });

      it('should convert $endsWith operator', () => {
        const input = { name: { $endsWith: 'Doe' } };
        const result = convertToTypeORMWhere(input);
        expect(result.name).toBeInstanceOf(FindOperator);
        expect((result.name as FindOperator<string>)['_type']).toBe('like');
      });

      it('should convert $contains operator', () => {
        const input = { description: { $contains: 'important' } };
        const result = convertToTypeORMWhere(input);
        expect(result.description).toBeInstanceOf(FindOperator);
        expect((result.description as FindOperator<string>)['_type']).toBe('like');
      });
    });

    describe('null check operators', () => {
      it('should convert $null: true to IsNull()', () => {
        const input = { deletedAt: { $null: true } };
        const result = convertToTypeORMWhere(input);
        expect(result.deletedAt).toBeInstanceOf(FindOperator);
      });

      it('should convert $null: false to Not(IsNull())', () => {
        const input = { deletedAt: { $null: false } };
        const result = convertToTypeORMWhere(input);
        expect(result.deletedAt).toBeInstanceOf(FindOperator);
      });
    });

    describe('complex operators', () => {
      it('should handle $and operator', () => {
        const input = { $and: [{ age: { $gte: 18 } }, { status: 'active' }] };
        const result = convertToTypeORMWhere(input);
        expect(result.$and).toBeDefined();
      });

      it('should handle $or operator', () => {
        const input = { $or: [{ age: { $lt: 18 } }, { status: 'pending' }] };
        const result = convertToTypeORMWhere(input);
        expect(result.$or).toBeDefined();
      });

      it('should handle $not operator', () => {
        const input = { $not: { status: 'deleted' } };
        const result = convertToTypeORMWhere(input);
        expect(result.$not).toBeDefined();
      });
    });

    describe('date handling', () => {
      it('should handle Date values without conversion', () => {
        const date = new Date('2024-01-15');
        const input = { createdAt: date };
        const result = convertToTypeORMWhere(input);
        expect(result.createdAt).toBe(date);
      });

      it('should handle Date with comparison operators', () => {
        const date = new Date('2024-01-15');
        const input = { createdAt: { $gte: date } };
        const result = convertToTypeORMWhere(input);
        expect(result.createdAt).toBeInstanceOf(FindOperator);
      });
    });

    describe('mixed conditions', () => {
      it('should handle multiple fields with different operators', () => {
        const input = {
          email: 'test@example.com',
          age: { $gte: 18 },
          status: { $in: ['active', 'pending'] },
        };
        const result = convertToTypeORMWhere(input);
        expect(result.email).toBe('test@example.com');
        expect(result.age).toBeInstanceOf(FindOperator);
        expect(result.status).toBeInstanceOf(FindOperator);
      });

      it('should handle combination of operators and literals', () => {
        const input = {
          name: 'John',
          age: { $gt: 18 },
          deletedAt: null,
        };
        const result = convertToTypeORMWhere(input);
        expect(result.name).toBe('John');
        expect(result.age).toBeInstanceOf(FindOperator);
        expect(result.deletedAt).toBeInstanceOf(FindOperator);
      });
    });

    describe('edge cases', () => {
      it('should handle empty object', () => {
        const input = {};
        const result = convertToTypeORMWhere(input);
        expect(result).toEqual({});
      });

      it('should handle operator object with no operators', () => {
        const input = { field: {} };
        const result = convertToTypeORMWhere(input);
        expect(result.field).toBeDefined();
      });

      it('should handle unknown operator', () => {
        const input = { field: { $unknownOperator: 'value' } };
        const result = convertToTypeORMWhere(input);
        expect(result.field).toBeInstanceOf(FindOperator);
      });

      it('should preserve FindOperator instances', () => {
        const operator = Equal('test');
        const input = { email: operator };
        const result = convertToTypeORMWhere(input);
        expect(result.email).toBe(operator);
      });
    });
  });

  describe('integration tests', () => {
    it('should handle full flow from better-auth format to TypeORM', () => {
      const betterAuthWhere = [{ field: 'email', value: 'test@example.com' }];
      const normalized = normalizeWhereClause(betterAuthWhere);
      const typeormWhere = convertToTypeORMWhere(normalized);

      expect(typeormWhere).toEqual({ email: 'test@example.com' });
    });

    it('should handle complex query with operators', () => {
      const betterAuthWhere = [
        { field: 'age', value: { $gte: 18 } },
        { field: 'status', value: { $in: ['active', 'pending'] } },
      ];
      const normalized = normalizeWhereClause(betterAuthWhere);
      const typeormWhere = convertToTypeORMWhere(normalized);

      expect(typeormWhere.age).toBeInstanceOf(FindOperator);
      expect(typeormWhere.status).toBeInstanceOf(FindOperator);
    });

    it('should handle null and undefined mixed with values', () => {
      const betterAuthWhere = [
        { field: 'email', value: 'test@example.com' },
        { field: 'deletedAt', value: null },
      ];
      const normalized = normalizeWhereClause(betterAuthWhere);
      const typeormWhere = convertToTypeORMWhere(normalized);

      expect(typeormWhere.email).toBe('test@example.com');
      expect(typeormWhere.deletedAt).toBeInstanceOf(FindOperator);
    });
  });
});
