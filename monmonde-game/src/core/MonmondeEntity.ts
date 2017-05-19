export abstract class MonmondeEntity<T> {

  public constructor(data?: T) {
    if (data) {
      Object.assign(this, data);
    }
  }

}
