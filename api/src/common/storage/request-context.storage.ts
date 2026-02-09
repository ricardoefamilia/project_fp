import { AsyncLocalStorage } from 'async_hooks';

export interface IRequestContext {
  requestIP?: string;
  user?: any;
}

export const requestStorage = new AsyncLocalStorage<IRequestContext>();

export class RequestContext {
  static run(context: IRequestContext, callback: () => void) {
    requestStorage.enterWith(context);
  }

  static get<T extends keyof IRequestContext>(key: T): IRequestContext[T] | undefined {
    return requestStorage.getStore()?.[key];
  }

  static getUserIdFromContext(): string | null {
    const user = this.get('user');
    const userId = (user && user.id) ?? null;
    return userId;
  }
}
