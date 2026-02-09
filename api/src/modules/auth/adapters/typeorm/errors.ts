/**
 * Base error class for all adapter errors
 */
export abstract class AdapterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when a record is not found
 */
export class RecordNotFoundError extends AdapterError {
  constructor(
    public readonly model: string,
    public readonly where: Record<string, unknown>,
  ) {
    super(
      `Record not found in ${model} with conditions: ${JSON.stringify(where)}`,
      'RECORD_NOT_FOUND',
      { model, where },
    );
  }
}

/**
 * Error thrown when where clause is invalid
 */
export class InvalidWhereClauseError extends AdapterError {
  constructor(
    public readonly where: unknown,
    public readonly reason: string,
  ) {
    super(`Invalid where clause: ${reason}`, 'INVALID_WHERE_CLAUSE', { where, reason });
  }
}

/**
 * Error thrown when schema validation fails
 */
export class SchemaValidationError extends AdapterError {
  constructor(
    public readonly model: string,
    public readonly field: string,
    public readonly reason: string,
  ) {
    super(`Schema validation failed for ${model}.${field}: ${reason}`, 'SCHEMA_VALIDATION_ERROR', {
      model,
      field,
      reason,
    });
  }
}

/**
 * Error thrown when database connection fails
 */
export class DatabaseConnectionError extends AdapterError {
  constructor(
    public readonly operation: string,
    public readonly originalError: Error,
  ) {
    super(
      `Database connection failed during ${operation}: ${originalError.message}`,
      'DATABASE_CONNECTION_ERROR',
      { operation, originalError: originalError.message },
    );
  }
}

/**
 * Error thrown when a database operation fails
 */
export class DatabaseOperationError extends AdapterError {
  constructor(
    public readonly operation: string,
    public readonly model: string,
    public readonly originalError: Error,
  ) {
    super(
      `Database operation '${operation}' failed for model '${model}': ${originalError.message}`,
      'DATABASE_OPERATION_ERROR',
      { operation, model, originalError: originalError.message },
    );
  }
}

/**
 * Error thrown when entity is not found in mapper
 */
export class EntityNotFoundError extends AdapterError {
  constructor(
    public readonly modelName: string,
    public readonly availableModels: string[],
  ) {
    super(
      `Unknown model: ${modelName}. Available models: ${availableModels.join(', ')}`,
      'ENTITY_NOT_FOUND',
      { modelName, availableModels },
    );
  }
}

/**
 * Error thrown when transaction fails
 */
export class TransactionError extends AdapterError {
  constructor(
    public readonly operation: string,
    public readonly originalError: Error,
  ) {
    super(`Transaction failed during ${operation}: ${originalError.message}`, 'TRANSACTION_ERROR', {
      operation,
      originalError: originalError.message,
    });
  }
}

/**
 * Error thrown when required field is missing
 */
export class RequiredFieldError extends AdapterError {
  constructor(
    public readonly model: string,
    public readonly field: string,
  ) {
    super(`Required field '${field}' is missing in model '${model}'`, 'REQUIRED_FIELD_ERROR', {
      model,
      field,
    });
  }
}
