import { describe, it, expect } from '@jest/globals';
import {
  AdapterError,
  RecordNotFoundError,
  InvalidWhereClauseError,
  SchemaValidationError,
  DatabaseConnectionError,
  DatabaseOperationError,
  EntityNotFoundError,
  TransactionError,
  RequiredFieldError,
} from './errors';

describe('Error Classes', () => {
  describe('RecordNotFoundError', () => {
    it('should create error with model and where clause', () => {
      const error = new RecordNotFoundError('user', { email: 'test@example.com' });

      expect(error).toBeInstanceOf(AdapterError);
      expect(error).toBeInstanceOf(RecordNotFoundError);
      expect(error.name).toBe('RecordNotFoundError');
      expect(error.code).toBe('RECORD_NOT_FOUND');
      expect(error.model).toBe('user');
      expect(error.where).toEqual({ email: 'test@example.com' });
      expect(error.message).toContain('Record not found');
      expect(error.message).toContain('user');
    });
  });

  describe('InvalidWhereClauseError', () => {
    it('should create error with where clause and reason', () => {
      const whereClause = [{ field: 'email' }];
      const error = new InvalidWhereClauseError(whereClause, 'Missing value');

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('InvalidWhereClauseError');
      expect(error.code).toBe('INVALID_WHERE_CLAUSE');
      expect(error.where).toBe(whereClause);
      expect(error.reason).toBe('Missing value');
      expect(error.message).toContain('Invalid where clause');
    });
  });

  describe('SchemaValidationError', () => {
    it('should create error with model, field, and reason', () => {
      const error = new SchemaValidationError('user', 'email', 'Field not found in schema');

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('SchemaValidationError');
      expect(error.code).toBe('SCHEMA_VALIDATION_ERROR');
      expect(error.model).toBe('user');
      expect(error.field).toBe('email');
      expect(error.reason).toBe('Field not found in schema');
      expect(error.message).toContain('Schema validation failed');
    });
  });

  describe('DatabaseConnectionError', () => {
    it('should create error with operation and original error', () => {
      const originalError = new Error('Connection timeout');
      const error = new DatabaseConnectionError('create', originalError);

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('DatabaseConnectionError');
      expect(error.code).toBe('DATABASE_CONNECTION_ERROR');
      expect(error.operation).toBe('create');
      expect(error.originalError).toBe(originalError);
      expect(error.message).toContain('Database connection failed');
    });
  });

  describe('DatabaseOperationError', () => {
    it('should create error with operation, model, and original error', () => {
      const originalError = new Error('Unique constraint violated');
      const error = new DatabaseOperationError('create', 'user', originalError);

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('DatabaseOperationError');
      expect(error.code).toBe('DATABASE_OPERATION_ERROR');
      expect(error.operation).toBe('create');
      expect(error.model).toBe('user');
      expect(error.originalError).toBe(originalError);
      expect(error.message).toContain('Database operation');
      expect(error.message).toContain('create');
      expect(error.message).toContain('user');
    });
  });

  describe('EntityNotFoundError', () => {
    it('should create error with model name and available models', () => {
      const availableModels = ['user', 'session', 'account'];
      const error = new EntityNotFoundError('invalid', availableModels);

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('EntityNotFoundError');
      expect(error.code).toBe('ENTITY_NOT_FOUND');
      expect(error.modelName).toBe('invalid');
      expect(error.availableModels).toEqual(availableModels);
      expect(error.message).toContain('Unknown model: invalid');
      expect(error.message).toContain('user, session, account');
    });
  });

  describe('TransactionError', () => {
    it('should create error with operation and original error', () => {
      const originalError = new Error('Deadlock detected');
      const error = new TransactionError('commit', originalError);

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('TransactionError');
      expect(error.code).toBe('TRANSACTION_ERROR');
      expect(error.operation).toBe('commit');
      expect(error.originalError).toBe(originalError);
      expect(error.message).toContain('Transaction failed');
    });
  });

  describe('RequiredFieldError', () => {
    it('should create error with model and field', () => {
      const error = new RequiredFieldError('user', 'email');

      expect(error).toBeInstanceOf(AdapterError);
      expect(error.name).toBe('RequiredFieldError');
      expect(error.code).toBe('REQUIRED_FIELD_ERROR');
      expect(error.model).toBe('user');
      expect(error.field).toBe('email');
      expect(error.message).toContain('Required field');
      expect(error.message).toContain('email');
      expect(error.message).toContain('user');
    });
  });

  describe('Error Context', () => {
    it('should include context in all errors', () => {
      const error = new RecordNotFoundError('user', { id: '123' });

      expect(error.context).toBeDefined();
      expect(error.context?.model).toBe('user');
      expect(error.context?.where).toEqual({ id: '123' });
    });

    it('should have stack trace', () => {
      const error = new RecordNotFoundError('user', {});

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('RecordNotFoundError');
    });
  });
});
