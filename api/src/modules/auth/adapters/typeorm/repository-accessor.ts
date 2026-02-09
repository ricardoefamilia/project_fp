import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import { EntityMapper } from './entity-mapper';

/**
 * Accesses TypeORM repositories for entities
 */
export class RepositoryAccessor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly entityMapper: EntityMapper,
  ) {}

  /**
   * Get repository for model
   */
  getRepository<T extends ObjectLiteral = ObjectLiteral>(modelName: string): Repository<T> {
    const entityClass = this.entityMapper.getEntityClass(modelName);
    return this.dataSource.getRepository(entityClass) as Repository<T>;
  }
}
