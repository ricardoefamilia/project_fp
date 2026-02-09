export interface SchemaConfig {
  [modelName: string]: {
    modelName: string;
    fields: {
      [betterAuthField: string]: string;
    };
  };
}

/**
 * Get database table name for a better-auth model
 *
 * @param model - Better-auth model name (e.g., 'user')
 * @param schema - Schema configuration
 * @returns Database table name (e.g., 'TB_USUARIO')
 */
export function getTableName(model: string, schema: SchemaConfig): string {
  return schema[model]?.modelName ?? model;
}

/**
 * Get database column name for a field
 *
 * @param model - Better-auth model name
 * @param field - Better-auth field name (e.g., 'email')
 * @param schema - Schema configuration
 * @returns Database column name (e.g., 'DS_EMAIL')
 */
export function getColumnName(model: string, field: string, schema: SchemaConfig): string {
  return schema[model]?.fields[field] ?? field;
}

/**
 * Get better-auth field name from database column
 *
 * @param model - Better-auth model name
 * @param column - Database column name (e.g., 'DS_EMAIL')
 * @param schema - Schema configuration
 * @returns Better-auth field name (e.g., 'email')
 */
export function getBetterAuthField(model: string, column: string, schema: SchemaConfig): string {
  const modelSchema = schema[model];

  if (!modelSchema) {
    return column;
  }

  const entry = Object.entries(modelSchema.fields).find(([_, dbColumn]) => dbColumn === column);

  return entry ? entry[0] : column;
}

/**
 * Map input fields from better-auth format to database format
 *
 * Input:  { email: 'test@example.com', name: 'John' }
 * Output: { DS_EMAIL: 'test@example.com', NO_USUARIO: 'John' }
 */
export function mapInputFields(
  model: string,
  data: Record<string, unknown>,
  schema: SchemaConfig,
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(data)) {
    const dbField = getColumnName(model, field, schema);
    mapped[dbField] = value;
  }

  return mapped;
}

/**
 * Map output fields from database format to better-auth format
 *
 * Input:  { DS_EMAIL: 'test@example.com', NO_USUARIO: 'John' }
 * Output: { email: 'test@example.com', name: 'John' }
 */
export function mapOutputFields(
  model: string,
  data: Record<string, unknown>,
  schema: SchemaConfig,
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [dbField, value] of Object.entries(data)) {
    const betterAuthField = getBetterAuthField(model, dbField, schema);
    mapped[betterAuthField] = value;
  }

  return mapped;
}

/**
 * Map where clause fields
 */
export function mapWhereClause(
  model: string,
  where: Record<string, unknown>,
  schema: SchemaConfig,
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(where)) {
    const dbField = getColumnName(model, field, schema);
    mapped[dbField] = value;
  }

  return mapped;
}

/**
 * Map select fields
 */
export function mapSelectFields(
  model: string,
  select: string[],
  schema: SchemaConfig,
): Record<string, boolean> {
  const mapped: Record<string, boolean> = {};

  for (const field of select) {
    const dbField = getColumnName(model, field, schema);
    mapped[dbField] = true;
  }

  return mapped;
}
