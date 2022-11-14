export default class Collection extends Map {
  public toArray() {
    return [...this.values()];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public filter(callbackFn: any, thisArg?: any) {
    return this.toArray().filter(callbackFn, thisArg);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public map(callbackFn: any, thisArg?: any) {
    return this.toArray().map(callbackFn, thisArg);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reduce(callbackFn: any, currentIndex: number) {
    return this.toArray().reduce(callbackFn, currentIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public find(predicate: any, thisArg?: any) {
    return this.toArray().find(predicate, thisArg);
  }
}
