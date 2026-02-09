/**
 * Selects specified fields from an entity
 */
export class FieldSelector {
  /**
   * Select only specified fields from result
   * Returns all fields if no selection specified
   */
  selectFields<T extends Record<string, unknown>>(entity: T, fields?: string[]): T {
    if (!fields || fields.length === 0) {
      return entity;
    }

    return this.filterFields(entity, fields);
  }

  /**
   * Select specified fields from multiple records
   */
  selectMany<T extends Record<string, unknown>>(entities: T[], fields?: string[]): T[] {
    if (!fields || fields.length === 0) {
      return entities;
    }

    return entities.map((entity) => this.selectFields(entity, fields));
  }

  /**
   * Filter entity to only include specified fields
   */
  private filterFields<T extends Record<string, unknown>>(entity: T, fields: string[]): T {
    const filtered: Record<string, unknown> = {};

    for (const field of fields) {
      if (this.hasField(entity, field)) {
        filtered[field] = entity[field];
      }
    }

    return filtered as T;
  }

  /**
   * Check if entity has field
   */
  private hasField(entity: Record<string, unknown>, field: string): boolean {
    return field in entity;
  }

  /**
   * Check if a field is selected
   */
  private isFieldSelected(field: string, fields?: string[]): boolean {
    if (!fields || fields.length === 0) {
      return true;
    }

    return fields.includes(field);
  }
}
