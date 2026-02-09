import { RequestContext } from 'src/common/storage/request-context.storage';
import {
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Audit } from '../entities/postgres/audit.entity';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<any> {
  private serialize(entity: any | undefined): string | undefined {
    if (!entity) return undefined;
    try {
      return JSON.stringify(entity);
    } catch {
      return undefined;
    }
  }

  private getEntityId(entity: any | undefined, metadata: EntityMetadata): string | null {
    if (!entity || !metadata) return null;
    const primaryColumns = metadata.primaryColumns;
    if (!primaryColumns || primaryColumns.length === 0) return null;
    if (primaryColumns.length === 1) {
      const prop = primaryColumns[0].propertyName;
      return String(entity[prop]);
    }
    const id: Record<string, unknown> = {};
    primaryColumns.forEach((col) => {
      const prop = col.propertyName;
      id[prop] = entity[prop];
    });
    return JSON.stringify(id);
  }

  private shouldSkip(targetName?: string): boolean {
    if (!targetName) return false;
    console.log('AuditSubscriber - Checking if should skip auditing for target:', targetName);
    return (
      targetName.toLowerCase() === 'audit' ||
      targetName.toLowerCase().endsWith('.audit') ||
      targetName.toLowerCase() === 'session' ||
      targetName.toLowerCase().endsWith('.session') ||
      targetName.toLowerCase() === 'usertransaction' ||
      targetName.toLowerCase().endsWith('.usertransaction')
    );
  }

  private getUserIdFromContext(): string | null {
    const user = RequestContext.get('user');
    const userId = (user && user.id) ?? null;
    return userId;
  }

  private getUserIpAddressFromContext(): string | null {
    const ip = RequestContext.get('requestIP');
    return ip ?? null;
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (this.shouldSkip(event.metadata?.name)) return;

    const audit = new Audit();
    audit.action = 'INSERT';
    audit.tableName = event.metadata?.tableName ?? event.metadata?.name ?? 'unknown';
    audit.primaryKey = this.getEntityId(event.entity, event.metadata) ?? undefined;
    audit.before = null;
    audit.after = this.serialize(event.entity);
    audit.userId = this.getUserIdFromContext();
    audit.ip = this.getUserIpAddressFromContext();
    console.log('AuditSubscriber - Creating audit log for insert:', audit);
    try {
      await event.manager.save(Audit, audit);
    } catch (err: unknown) {
      console.error('Failed to save audit (insert):', (err as Error)?.message ?? err);
    }
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (this.shouldSkip(event.metadata?.name)) return;

    const audit = new Audit();
    audit.action = 'UPDATE';
    audit.tableName = event.metadata?.tableName ?? event.metadata?.name ?? 'unknown';
    audit.primaryKey = this.getEntityId(event.entity, event.metadata) ?? undefined;
    audit.before = this.serialize(event.databaseEntity);
    audit.after = this.serialize(event.entity);
    audit.userId = this.getUserIdFromContext();
    audit.ip = this.getUserIpAddressFromContext();
    console.log('AuditSubscriber - Creating audit log for update:', audit);
    try {
      await event.manager.save(Audit, audit);
    } catch (err: unknown) {
      console.error('Failed to save audit (update):', (err as Error)?.message ?? err);
    }
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (this.shouldSkip(event.metadata?.name)) return;

    const audit = new Audit();
    audit.action = 'REMOVE';
    audit.tableName = event.metadata?.tableName ?? event.metadata?.name ?? 'unknown';
    audit.primaryKey = this.getEntityId(event.databaseEntity, event.metadata) ?? undefined;
    audit.before = this.serialize(event.databaseEntity);
    audit.after = null;
    audit.userId = this.getUserIdFromContext();
    audit.ip = this.getUserIpAddressFromContext();
    console.log('AuditSubscriber - Creating audit log for remove:', audit);

    try {
      await event.manager.save(Audit, audit);
    } catch (err: unknown) {
      console.error('Failed to save audit (remove):', (err as Error)?.message ?? err);
    }
  }
}
