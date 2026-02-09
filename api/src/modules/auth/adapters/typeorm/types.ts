import { type DBAdapterDebugLogOption } from 'better-auth/adapters';

/**
 * Schema Configuration
 */
export interface SchemaConfig {
  [modelName: string]: {
    modelName: string;
    fields: {
      [betterAuthField: string]: string;
    };
  };
}

/**
 * TypeORM Adapter Configuration
 */
export interface TypeORMAdapterConfig {
  /**
   * Database provider type
   */
  provider?: 'oracle' | 'postgres' | 'mysql' | 'sqlite' | 'mssql';

  /**
   * Enable debug logging
   */
  debugLogs?: DBAdapterDebugLogOption;

  /**
   * Better-Auth schema configuration
   * Maps better-auth models to database tables and fields
   */
  schema?: SchemaConfig;

  /**
   * Whether to use plural table names
   */
  usePlural?: boolean;

  /**
   * Custom ID generation function
   */
  generateId?: () => string;
}

/**
 * Base parameters for adapter operations
 */
export interface BaseParams {
  model: string;
  select?: string[];
}

/**
 * Create operation parameters
 */
export interface CreateParams extends BaseParams {
  data: Record<string, string>;
}

/**
 * Find one operation parameters
 */
export interface FindOneParams extends BaseParams {
  where: WhereClause[];
}

/**
 * Find many operation parameters
 */
export interface FindManyParams extends BaseParams {
  where?: WhereClause[];
  limit?: number;
  offset?: number;
  sortBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

/**
 * Update operation parameters
 */
export interface UpdateParams extends BaseParams {
  where: WhereClause[];
  data: Record<string, string>;
}

/**
 * Update many operation parameters
 */
export interface UpdateManyParams extends BaseParams {
  where: WhereClause[];
  data: Record<string, string>;
}

/**
 * Delete operation parameters
 */
export interface DeleteParams extends BaseParams {
  where: WhereClause[];
}

/**
 * Delete many operation parameters
 */
export interface DeleteManyParams extends BaseParams {
  where: WhereClause[];
}

/**
 * Better-Auth Where Clause Format
 */
export type WhereClause =
  | { field: string; value: string }
  | { field: string; operator: string; value: string }
  | Record<string, string>;
