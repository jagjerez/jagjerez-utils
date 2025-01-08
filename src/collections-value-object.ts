import { IEquality } from "./equality.interface";
import _ from "lodash";

type predicate<T extends IEquality, R> = (
  value: T,
  index: number,
  array: T[]
) => R;

export abstract class CollectionValueObject<T extends IEquality>
  implements Array<T>, ReadonlyArray<T>
{
  private _items: Array<T>;
  public get items(): ReadonlyArray<T> {
    return Object.freeze([...this._items]); // Ensure immutability
  }
  public get length() {
    return this.items.length;
  }

  constructor(items: T[]) {
    this._items = _.cloneDeep([...items]);
  }

  remove(predicate: predicate<T, boolean>): void {
    this._items = _.cloneDeep([...this._items.filter(predicate)]);
  }

  pop(): T | undefined {
    return this._items.pop();
  }
  push(...items: T[]): number {
    return this._items.push(...items);
  }
  reverse(): T[] {
    return this._items.reverse();
  }
  shift(): T | undefined {
    return this._items.shift();
  }
  sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    const newItems = _.cloneDeep([...this.items]); // Create a mutable copy of the items
    newItems.sort(compareFn); // Use the native Array.fill method
    return new (this.constructor as new (items: T[]) => this)(newItems); // Return a new instance
  }
  splice(start: number, deleteCount?: number, ...rest: T[]): T[] {
    if (deleteCount) {
      return this._items.splice(start, deleteCount, ...rest);
    } else {
      return this._items.splice(start);
    }
  }
  unshift(...items: T[]): number {
    return this._items.unshift(...items);
  }

  every<S extends T>(predicate: predicate<T, S>): this is S[] {
    return this._items.every((x, i, a) => predicate(x, i, a), this);
  }
  some(predicate: predicate<T, boolean>): boolean {
    return this._items.some((x, i, a) => predicate(x, i, a), this);
  }
  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
    this._items.flatMap(callbackfn, this);
  }
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
    return this._items.map(callbackfn, this);
  }
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue?: T
  ): T {
    if (initialValue) {
      return this._items.reduce(callbackfn, initialValue);
    } else {
      return this._items.reduce(callbackfn);
    }
  }
  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;
  reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue?: T
  ): T {
    if (initialValue) {
      return this._items.reduceRight(callbackfn, initialValue);
    } else {
      return this._items.reduceRight(callbackfn);
    }
  }
  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number {
    return this._items.findIndex(predicate, this);
  }
  fill(value: T, start?: number, end?: number): this {
    const newItems = _.cloneDeep([...this.items]); // Create a mutable copy of the items
    newItems.fill(value, start, end); // Use the native Array.fill method
    return new (this.constructor as new (items: T[]) => this)(newItems); // Return a new instance
  }
  copyWithin(target: number, start: number, end?: number): this {
    const newItems = _.cloneDeep([...this.items]); // Create a mutable copy of the items
    newItems.copyWithin(target, start, end); // Use the native Array.copyWithin method
    return new (this.constructor as new (items: T[]) => this)(newItems); // Return a new instance
  }
  [Symbol.iterator](): ArrayIterator<T> {
    return this._items[Symbol.iterator](); // Delegate to the native Array iterator
  }
  [Symbol.unscopables]!: {
    [x: number]: boolean | undefined;
    length?: boolean | undefined;
    toString?: boolean | undefined;
    toLocaleString?: boolean | undefined;
    pop?: boolean | undefined;
    push?: boolean | undefined;
    concat?: boolean | undefined;
    join?: boolean | undefined;
    reverse?: boolean | undefined;
    shift?: boolean | undefined;
    slice?: boolean | undefined;
    sort?: boolean | undefined;
    splice?: boolean | undefined;
    unshift?: boolean | undefined;
    indexOf?: boolean | undefined;
    lastIndexOf?: boolean | undefined;
    every?: boolean | undefined;
    some?: boolean | undefined;
    forEach?: boolean | undefined;
    map?: boolean | undefined;
    filter?: boolean | undefined;
    reduce?: boolean | undefined;
    reduceRight?: boolean | undefined;
    find?: boolean | undefined;
    findIndex?: boolean | undefined;
    fill?: boolean | undefined;
    copyWithin?: boolean | undefined;
    entries?: boolean | undefined;
    keys?: boolean | undefined;
    values?: boolean | undefined;
    includes?: boolean | undefined;
    flatMap?: boolean | undefined;
    flat?: boolean | undefined;
    [Symbol.iterator]?: boolean | undefined;
    readonly [Symbol.unscopables]?: boolean | undefined;
    at?: boolean | undefined;
  };
  readonly [n: number]: T;
  toString(): string {
    return JSON.stringify(this.items);
  }
  toLocaleString(locales?: unknown, options?: unknown): string {
    return JSON.stringify(this.items);
  }
  concat(...items: ConcatArray<T>[]): T[] {
    return this._items.concat(...items);
  }
  join(separator?: string): string {
    return this._items.join(separator);
  }
  slice(start?: number, end?: number): T[] {
    return this._items.slice(start, end);
  }
  indexOf(searchElement: T): number {
    return this._items.findIndex((x) => x.compare(searchElement), this);
  }
  lastIndexOf(searchElement: T): number {
    return this._items.findIndex((x) => x.compare(searchElement), this);
  }

  filter(predicate: predicate<T, boolean>): T[] {
    return this._items.filter(
      (x, index, array) => predicate(x, index, array),
      this
    );
  }
  find(predicate: predicate<T, boolean>): T | undefined {
    return this._items.find(predicate, this);
  }
  entries(): ArrayIterator<[number, T]> {
    return this._items.entries();
  }
  keys(): ArrayIterator<number> {
    return this._items.keys();
  }
  values(): ArrayIterator<T> {
    return this._items.values();
  }
  includes(searchElement: T, fromIndex?: number): boolean {
    return this._items.includes(searchElement, fromIndex);
  }
  flatMap<U, This = undefined>(
    callback: (
      this: This,
      value: T,
      index: number,
      array: T[]
    ) => U | readonly U[],
    thisArg?: This | undefined
  ): U[] {
    return this._items.flatMap(callback, thisArg);
  }
  flat<A, D extends number = 1>(depth?: D | undefined): FlatArray<A, D>[] {
    return this._items.flat(depth) as FlatArray<A, D>[];
  }
  at(index: number): T | undefined {
    return this._items.at(index);
  }
}
