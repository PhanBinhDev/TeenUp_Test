import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  static set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  static get(key: string): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }

  static run(callback: () => void) {
    this.asyncLocalStorage.run(new Map(), callback);
  }
}
