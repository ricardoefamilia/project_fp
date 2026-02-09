import { EntityTarget, ObjectLiteral } from 'typeorm';
import { Account } from '../../../../database/entities/postgres/account.entity';
import { Invitation } from '../../../../database/entities/postgres/invitation.entity';
import { Member } from '../../../../database/entities/postgres/member.entity';
import { Organization } from '../../../../database/entities/postgres/organization.entity';
import { Session } from '../../../../database/entities/postgres/session.entity';
import { TwoFactor } from '../../../../database/entities/postgres/two-factor.entity';
import { User } from '../../../../database/entities/postgres/user.entity';
import { Verification } from '../../../../database/entities/postgres/verification.entity';
import type { ModelName } from './adapter-types';
import { EntityNotFoundError } from './errors';

/**
 * Entity map type
 */
type EntityMap = Record<ModelName, EntityTarget<ObjectLiteral>>;

/**
 * Entity mapping registry
 * Encapsulates the mapping between model names and entity classes
 */
export class EntityMapper {
  private readonly entities: EntityMap;

  constructor() {
    this.entities = {
      user: User,
      session: Session,
      account: Account,
      verification: Verification,
      twoFactor: TwoFactor,
      organization: Organization,
      member: Member,
      invitation: Invitation,
    };
  }

  /**
   * Get entity class for a model name
   */
  getEntityClass(modelName: string): EntityTarget<ObjectLiteral> {
    const entity = this.entities[modelName as ModelName];

    if (!entity) {
      throw new EntityNotFoundError(modelName, this.getAvailableModels());
    }

    return entity;
  }

  /**
   * Check if model name is valid
   */
  public isValidModelName(modelName: string): boolean {
    return modelName in this.entities;
  }

  /**
   * Get list of available model names
   */
  public getAvailableModels(): string[] {
    return Object.keys(this.entities);
  }
}

/**
 * Get entity class for a model name (standalone function)
 * This is a convenience function that creates a mapper instance
 *
 * @param modelName - Better-Auth model name
 * @param _schema - Optional schema configuration (reserved for future use)
 * @returns TypeORM entity class
 */
export function getEntityClass(
  modelName: string,
  _schema?: Record<string, { modelName: string }>,
): EntityTarget<ObjectLiteral> {
  const mapper = new EntityMapper();
  return mapper.getEntityClass(modelName);
}
