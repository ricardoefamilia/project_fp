/**
 * Better-Auth model names
 */
export type ModelName =
  | 'user'
  | 'session'
  | 'account'
  | 'verification'
  | 'twoFactor'
  | 'organization'
  | 'member'
  | 'invitation';

/**
 * Where clause from Better-Auth
 */
export interface WhereCondition extends Record<string, unknown> {
  field: string;
  value: unknown;
  operator?: string;
  connector?: string;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortBy {
  field: string;
  direction: SortDirection;
}

/**
 * Create operation parameters
 */
export interface CreateOperation<T = Record<string, unknown>> {
  model: string;
  data: T;
  select?: string[];
}

/**
 * Find one operation parameters
 */
export interface FindOneOperation {
  model: string;
  where: WhereCondition[] | Record<string, unknown>;
  select?: string[];
}

/**
 * Find many operation parameters
 */
export interface FindManyOperation {
  model: string;
  where?: WhereCondition[] | Record<string, unknown>;
  limit?: number;
  offset?: number;
  sortBy?: SortBy;
}

/**
 * Count operation parameters
 */
export interface CountOperation {
  model: string;
  where?: WhereCondition[] | Record<string, unknown>;
}

/**
 * Update operation parameters
 */
export interface UpdateOperation<T = Record<string, unknown>> {
  model: string;
  where: WhereCondition[] | Record<string, unknown>;
  update: T;
}

/**
 * Delete operation parameters
 */
export interface DeleteOperation {
  model: string;
  where: WhereCondition[] | Record<string, unknown>;
}

/**
 * Better-Auth adapter interface
 */
export interface BetterAuthAdapter {
  id: string;
  create: (params: CreateOperation) => Promise<Record<string, unknown>>;
  findOne: (params: FindOneOperation) => Promise<Record<string, unknown> | null>;
  findMany: (params: FindManyOperation) => Promise<Record<string, unknown>[]>;
  count: (params: CountOperation) => Promise<number>;
  update: (params: UpdateOperation) => Promise<Record<string, unknown>>;
  updateMany: (params: UpdateOperation) => Promise<void>;
  delete: (params: DeleteOperation) => Promise<void>;
  deleteMany: (params: DeleteOperation) => Promise<void>;
}

/**
 * TypeORM find options (subset we use)
 */
export interface FindOptions {
  where?: Record<string, unknown>;
  select?: string[];
  take?: number;
  skip?: number;
  order?: Record<string, string>;
}
