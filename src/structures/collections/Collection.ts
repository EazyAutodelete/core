export default class Collection extends Map {
  public toArray() {
    return [...this.values()];
  }

  public filter(callbackFn: any, thisArg?: any) {
    return this.toArray().filter(callbackFn, thisArg);
  }

  public map(callbackFn: any, thisArg?: any) {
    return this.toArray().map(callbackFn, thisArg);
  }

  public reduce(callbackFn: any, currentIndex: number) {
    return this.toArray().reduce(callbackFn, currentIndex);
  }

  public find(predicate: any, thisArg?: any) {
    return this.toArray().find(predicate, thisArg);
  }
}
