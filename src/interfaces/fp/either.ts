export type Either<T, U> = Left<T> | Right<U>;

export interface Left<T> {
  _tag: "Left";
  value: T;
}

export interface Right<T> {
  _tag: "Right";
  value: T;
}
