import {
  Equal,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
} from 'typeorm';

/**
 * Better-Auth field-value condition format
 */
interface FieldValueCondition extends Record<string, unknown> {
  field: string;
  value: unknown;
  operator?: string;
  connector?: string;
}

/**
 * Type guard to check if a value is a FieldValueCondition
 * Format: { field: 'email', value: 'test@example.com' }
 */
function isFieldValueCondition(value: unknown): value is FieldValueCondition {
  return (
    value !== null &&
    typeof value === 'object' &&
    'field' in value &&
    'value' in value &&
    typeof (value as FieldValueCondition).field === 'string'
  );
}

/**
 * Better-Auth where clause can be:
 * - Array of conditions
 * - Single condition
 * - Standard object
 */
export type WhereInput =
  | FieldValueCondition
  | FieldValueCondition[]
  | Record<string, unknown>
  | null
  | undefined;

/**
 * Operator object with MongoDB-style operators
 */
interface OperatorObject {
  $eq?: unknown;
  $ne?: unknown;
  $gt?: unknown;
  $gte?: unknown;
  $lt?: unknown;
  $lte?: unknown;
  $in?: unknown[];
  $nin?: unknown[];
  $like?: string;
  $ilike?: string;
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
  $null?: boolean;
  $and?: Record<string, unknown>[];
  $or?: Record<string, unknown>[];
  $not?: Record<string, unknown>;
}

/**
 * Better-Auth Format:
 * [{ field: 'email', value: 'test@example.com' }]
 *
 * Normalized Format:
 * { email: 'test@example.com' }
 */
export function normalizeWhereClause(where: WhereInput): Record<string, unknown> {
  if (!where) {
    return {};
  }

  if (Array.isArray(where) && where.length === 0) {
    return {};
  }

  if (Array.isArray(where)) {
    const normalized: Record<string, unknown> = {};

    for (const condition of where) {
      if (!condition) {
        continue;
      }

      if (isFieldValueCondition(condition)) {
        normalized[condition.field] = condition.value;
        continue;
      }

      if (typeof condition === 'object' && !Array.isArray(condition)) {
        Object.assign(normalized, condition);
      }
    }

    return normalized;
  }

  if (isFieldValueCondition(where)) {
    return { [where.field]: where.value };
  }

  if (typeof where === 'object' && where !== null) {
    return where;
  }

  return {};
}

/**
 * Input:
 * { email: 'test@example.com', age: { $gt: 18 }, id: [uuid1, uuid2] }
 *
 * Output:
 * { email: 'test@example.com', age: MoreThan(18), id: In([uuid1, uuid2]) }
 */
export function convertToTypeORMWhere(
  where: Record<string, unknown>,
): FindOptionsWhere<ObjectLiteral> {
  const converted: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(where)) {
    if (value === null) {
      converted[field] = IsNull();
      continue;
    }

    if (value === undefined) {
      continue;
    }

    // Se o valor é um array, interpreta como condição In
    if (Array.isArray(value)) {
      converted[field] = In(value);
      continue;
    }

    if (!(value instanceof Date) && !(value instanceof FindOperator) && isOperatorObject(value)) {
      converted[field] = translateOperator(value as Record<string, unknown>);
      continue;
    }

    converted[field] = value;
  }

  return converted;
}

/**
 * Translate MongoDB-style operators to TypeORM FindOperators
 */
function translateOperator(operatorObj: Record<string, unknown>): FindOperator<unknown> {
  const entries = Object.entries(operatorObj);

  if (entries.length === 0) {
    return Equal(operatorObj);
  }

  if (entries.length === 1) {
    const [operator, value] = entries[0];

    switch (operator) {
      case '$eq':
        return Equal(value);
      case '$ne':
        return Not(Equal(value));
      case '$gt':
        return MoreThan(value);
      case '$gte':
        return MoreThanOrEqual(value);
      case '$lt':
        return LessThan(value);
      case '$lte':
        return LessThanOrEqual(value);
      case '$in':
        return In(Array.isArray(value) ? value : [value]);
      case '$nin':
        return Not(In(Array.isArray(value) ? value : [value]));
      case '$like':
        return Like(String(value));
      case '$ilike':
        return ILike(String(value));
      case '$startsWith':
        return Like(`${String(value)}%`);
      case '$endsWith':
        return Like(`%${String(value)}`);
      case '$contains':
        return Like(`%${String(value)}%`);
      case '$null':
        return value ? IsNull() : Not(IsNull());
      default:
        return Equal(value);
    }
  }

  if ('$and' in operatorObj) {
    const conditions = (operatorObj.$and as Record<string, unknown>[]).map((condition) =>
      convertToTypeORMWhere(condition),
    );

    return Object.assign({}, ...conditions) as FindOperator<unknown>;
  }

  if ('$or' in operatorObj) {
    const conditions = (operatorObj.$or as Record<string, unknown>[]).map((condition) =>
      convertToTypeORMWhere(condition),
    );

    return conditions as unknown as FindOperator<unknown>;
  }

  if ('$not' in operatorObj) {
    const condition = convertToTypeORMWhere(operatorObj.$not as Record<string, unknown>);

    return Not(condition) as FindOperator<unknown>;
  }

  return Equal(operatorObj);
}

/**
 * Check if a value is an operator object
 */
function isOperatorObject(value: unknown): value is OperatorObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  return keys.length > 0 && keys.some((key) => key.startsWith('$'));
}
