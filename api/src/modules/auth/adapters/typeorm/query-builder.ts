import { FindOneOptions, FindManyOptions } from 'typeorm';
import { normalizeWhereClause, convertToTypeORMWhere, type WhereInput } from './query-translator';
import type { FindManyOperation, SortDirection } from './adapter-types';

export class QueryOptionsBuilder {
  /**
   * Build find options for findOne operation
   */
  buildFindOneOptions<T>(where: WhereInput, select?: string[]): FindOneOptions<T> {
    const normalized = normalizeWhereClause(where);
    const typeormWhere = convertToTypeORMWhere(normalized);

    return {
      where: typeormWhere as FindOneOptions<T>['where'],
      select: select as FindOneOptions<T>['select'],
    };
  }

  /**
   * Build find options for findMany operation
   */
  buildFindManyOptions<T>(params: FindManyOperation): FindManyOptions<T> {
    const options: FindManyOptions<T> = {};

    if (params.where) {
      options.where = this.buildWhereClause<T>(params.where);
    }

    if (params.limit !== undefined) {
      options.take = params.limit;
    }

    if (params.offset !== undefined) {
      options.skip = params.offset;
    }

    if (params.sortBy) {
      options.order = this.buildOrderClause(
        params.sortBy.field,
        params.sortBy.direction,
      ) as FindManyOptions<T>['order'];
    }

    return options;
  }

  /**
   * Build where clause
   */
  private buildWhereClause<T>(where: WhereInput): FindManyOptions<T>['where'] {
    const normalized = normalizeWhereClause(where);
    const converted = convertToTypeORMWhere(normalized);
    return converted as FindManyOptions<T>['where'];
  }

  /**
   * Build order clause
   */
  private buildOrderClause(field: string, direction: SortDirection): Record<string, string> {
    return {
      [field]: direction.toUpperCase(),
    };
  }
}
