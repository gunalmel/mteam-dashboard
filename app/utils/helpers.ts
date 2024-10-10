export function omit<T, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...newObj } = obj;
  return newObj;
}

export class DeepSet<T extends object> {
  #items: T[];

  constructor(iterable: Iterable<T> = []) {
    this.#items = [];
    for (const item of iterable) {
      this.add(item);
    }
  }

  get items() {
    return this.#items;
  }

  add(value: T): this {
    if (!this.has(value)) {
      this.#items.push(value);
    }
    return this;
  }

  has(value: T): boolean {
    return this.#items.some(item => this.#deepEqual(item, value));
  }

  size(): number {
    return this.#items.length;
  }

  clear(): void {
    this.#items = [];
  }

  delete(value: T): boolean {
    const index = this.#items.findIndex(item => this.#deepEqual(item, value));
    if (index > -1) {
      this.#items.splice(index, 1);
      return true;
    }
    return false;
  }

  // Deep equality function using strict types
  #deepEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      // TypeScript needs a type assertion here since obj1 and obj2 are unknown
      if (!keys2.includes(key) || !this.#deepEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])) {
        return false;
      }
    }

    return true;
  }
}

