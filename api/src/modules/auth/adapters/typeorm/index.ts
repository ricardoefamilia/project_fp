/**
 * TypeORM Adapter for Better-Auth
 *
 * This adapter enables Better-Auth to work with TypeORM, providing:
 * - OracleDB support through TypeORM
 * - Custom schema mappings for non-standard column names
 * - Full CRUD operation support
 * - Query translation from Better-Auth format to TypeORM format
 *
 * @example
 * ```typescript
 * import { betterAuth } from 'better-auth';
 * import { typeormAdapter } from './adapters/typeorm';
 * import { dataSource } from './config/oracle.config';
 * import { authSchema } from './auth-schema';
 *
 * export const auth = betterAuth({
 *   database: typeormAdapter(dataSource, {
 *     provider: 'oracle',
 *     debugLogs: true,
 *     schema: authSchema,
 *   }),
 * });
 * ```
 */
export { typeormAdapter } from './typeorm.adapter';

export type { TypeORMAdapterConfig } from './types';

export type {
  BetterAuthAdapter,
  ModelName,
  WhereCondition,
  SortDirection,
  SortBy,
  CreateOperation,
  FindOneOperation,
  FindManyOperation,
  CountOperation,
  UpdateOperation,
  DeleteOperation,
  FindOptions,
} from './adapter-types';

export { EntityMapper } from './entity-mapper';
export { RepositoryAccessor } from './repository-accessor';
export { QueryOptionsBuilder } from './query-builder';
export { FieldSelector } from './field-selector';

export { normalizeWhereClause, convertToTypeORMWhere } from './query-translator';
export type { WhereInput } from './query-translator';

export {
  getTableName,
  getColumnName,
  getBetterAuthField,
  mapInputFields,
  mapOutputFields,
  mapWhereClause,
  mapSelectFields,
} from './schema-mapper';
export type { SchemaConfig } from './schema-mapper';

export { getEntityClass } from './entity-mapper';

export {
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
