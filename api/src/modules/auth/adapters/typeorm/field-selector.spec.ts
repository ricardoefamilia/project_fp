import { FieldSelector } from './field-selector';

describe('FieldSelector', () => {
  let fieldSelector: FieldSelector;

  beforeEach(() => {
    fieldSelector = new FieldSelector();
  });

  describe('selectFields', () => {
    it('should return all fields when select is undefined', () => {
      const data = { id: '1', email: 'test@example.com', name: 'John' };
      const result = fieldSelector.selectFields(data, undefined);

      expect(result).toEqual(data);
    });

    it('should return all fields when select is empty array', () => {
      const data = { id: '1', email: 'test@example.com', name: 'John' };
      const result = fieldSelector.selectFields(data, []);

      expect(result).toEqual(data);
    });

    it('should select specific fields', () => {
      const data = { id: '1', email: 'test@example.com', name: 'John', age: 25 };
      const select = ['id', 'email'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should select single field', () => {
      const data = { id: '1', email: 'test@example.com', name: 'John' };
      const select = ['email'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ email: 'test@example.com' });
    });

    it('should ignore non-existent fields in select', () => {
      const data = { id: '1', email: 'test@example.com' };
      const select = ['id', 'nonExistent'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ id: '1' });
    });

    it('should handle empty data object', () => {
      const data = {};
      const select = ['id', 'email'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({});
    });

    it('should handle data with null values', () => {
      const data = { id: '1', email: null, name: 'John' };
      const select = ['id', 'email', 'name'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ id: '1', email: null, name: 'John' });
    });

    it('should handle data with undefined values', () => {
      const data = { id: '1', email: undefined, name: 'John' };
      const select = ['id', 'email', 'name'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ id: '1', email: undefined, name: 'John' });
    });

    it('should preserve value types', () => {
      const data = {
        id: '1',
        count: 42,
        active: true,
        createdAt: new Date('2024-01-15'),
        metadata: { key: 'value' },
      };
      const select = ['id', 'count', 'active', 'createdAt', 'metadata'];
      const result = fieldSelector.selectFields(data, select);

      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.metadata).toEqual({ key: 'value' });
    });

    it('should handle nested objects', () => {
      const data = {
        id: '1',
        user: {
          name: 'John',
          email: 'john@example.com',
        },
      };
      const select = ['user'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({
        user: {
          name: 'John',
          email: 'john@example.com',
        },
      });
    });

    it('should handle arrays', () => {
      const data = {
        id: '1',
        tags: ['tag1', 'tag2', 'tag3'],
        permissions: [{ read: true }, { write: false }],
      };
      const select = ['tags', 'permissions'];
      const result = fieldSelector.selectFields(data, select);

      expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
      expect(result.permissions).toEqual([{ read: true }, { write: false }]);
    });

    it('should not modify original data', () => {
      const data = { id: '1', email: 'test@example.com', name: 'John' };
      const select = ['id', 'email'];
      const result = fieldSelector.selectFields(data, select);

      expect(data).toEqual({ id: '1', email: 'test@example.com', name: 'John' });
      expect(result).not.toEqual(data);
    });

    it('should handle duplicate fields in select', () => {
      const data = { id: '1', email: 'test@example.com', name: 'John' };
      const select = ['id', 'email', 'email'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });
  });

  describe('selectMany', () => {
    it('should apply selection to all records', () => {
      const data = [
        { id: '1', email: 'test1@example.com', name: 'John' },
        { id: '2', email: 'test2@example.com', name: 'Jane' },
      ];
      const select = ['id', 'email'];
      const result = fieldSelector.selectMany(data, select);

      expect(result).toEqual([
        { id: '1', email: 'test1@example.com' },
        { id: '2', email: 'test2@example.com' },
      ]);
    });

    it('should handle empty array', () => {
      const data: Array<Record<string, unknown>> = [];
      const select = ['id', 'email'];
      const result = fieldSelector.selectMany(data, select);

      expect(result).toEqual([]);
    });

    it('should return all records when select is undefined', () => {
      const data = [
        { id: '1', email: 'test1@example.com' },
        { id: '2', email: 'test2@example.com' },
      ];
      const result = fieldSelector.selectMany(data, undefined);

      expect(result).toEqual(data);
    });

    it('should handle single record array', () => {
      const data = [{ id: '1', email: 'test@example.com', name: 'John' }];
      const select = ['email'];
      const result = fieldSelector.selectMany(data, select);

      expect(result).toEqual([{ email: 'test@example.com' }]);
    });

    it('should preserve array order', () => {
      const data = [
        { id: '3', name: 'Charlie' },
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ];
      const select = ['name'];
      const result = fieldSelector.selectMany(data, select);

      expect(result[0].name).toBe('Charlie');
      expect(result[1].name).toBe('Alice');
      expect(result[2].name).toBe('Bob');
    });
  });

  describe('isFieldSelected', () => {
    it('should return true when field is in select list', () => {
      const select = ['id', 'email', 'name'];
      const result = fieldSelector['isFieldSelected']('email', select);

      expect(result).toBe(true);
    });

    it('should return false when field is not in select list', () => {
      const select = ['id', 'email'];
      const result = fieldSelector['isFieldSelected']('name', select);

      expect(result).toBe(false);
    });

    it('should return true when select is undefined', () => {
      const result = fieldSelector['isFieldSelected']('email', undefined);

      expect(result).toBe(true);
    });

    it('should return true when select is empty array', () => {
      const result = fieldSelector['isFieldSelected']('email', []);

      expect(result).toBe(true);
    });

    it('should handle case-sensitive field names', () => {
      const select = ['email'];
      expect(fieldSelector['isFieldSelected']('email', select)).toBe(true);
      expect(fieldSelector['isFieldSelected']('Email', select)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle user query with select fields', () => {
      const users = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User 1',
          password: 'hashed_password',
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User 2',
          password: 'hashed_password',
          createdAt: new Date(),
        },
      ];
      const select = ['id', 'email', 'name'];
      const result = fieldSelector.selectMany(users, select);

      expect(result).toHaveLength(2);
      result.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).not.toHaveProperty('password');
        expect(user).not.toHaveProperty('createdAt');
      });
    });

    it('should handle session query returning all fields', () => {
      const session = {
        id: 'session-id',
        userId: 'user-id',
        token: 'session-token',
        expiresAt: new Date(),
        ipAddress: '127.0.0.1',
      };
      const result = fieldSelector.selectFields(session);

      expect(result).toEqual(session);
    });

    it('should handle partial field selection for performance', () => {
      const largeObject = {
        id: '1',
        email: 'test@example.com',
        name: 'John',
        biography: 'Very long biography text...',
        preferences: { theme: 'dark', language: 'en' },
        metadata: {
          /* large metadata object */
        },
      };
      const select = ['id', 'email', 'name'];
      const result = fieldSelector.selectFields(largeObject, select);

      expect(Object.keys(result)).toHaveLength(3);
      expect(result).not.toHaveProperty('biography');
      expect(result).not.toHaveProperty('preferences');
      expect(result).not.toHaveProperty('metadata');
    });
  });

  describe('edge cases', () => {
    it('should handle object with numeric keys', () => {
      const data = { 1: 'value1', 2: 'value2', name: 'test' };
      const select = ['1', 'name'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ 1: 'value1', name: 'test' });
    });

    it('should handle object with special characters in keys', () => {
      const data = { 'field-name': 'value1', 'field.name': 'value2', normal: 'value3' };
      const select = ['field-name', 'normal'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ 'field-name': 'value1', normal: 'value3' });
    });

    it('should handle zero as a value', () => {
      const data = { id: '1', count: 0, active: false };
      const select = ['count', 'active'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ count: 0, active: false });
    });

    it('should handle empty string as value', () => {
      const data = { id: '1', name: '', email: 'test@example.com' };
      const select = ['name', 'email'];
      const result = fieldSelector.selectFields(data, select);

      expect(result).toEqual({ name: '', email: 'test@example.com' });
    });
  });
});
