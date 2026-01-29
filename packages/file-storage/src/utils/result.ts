import { Result } from "ts-results";

export type AwaitedResult<T, E> = Promise<Result<T, E>> & {
  map<T2>(func: (val: T) => T2): AwaitedResult<T2, E>;
  mapErr<E2>(func: (err: E) => E2): AwaitedResult<T, E2>;
  expect(msg: string): Promise<T>;
  unwrap(): Promise<T>;
  unwrapOr<T2>(val: T2): Promise<T | T2>;
};

export function awaited<T, E>(promise: Promise<Result<T, E>>): AwaitedResult<T, E> {
  return Object.assign(promise, {
    map: <T2>(func: (val: T) => T2): AwaitedResult<T2, E> =>
      awaited(promise.then(r => r.map(func))),
    mapErr: <E2>(func: (err: E) => E2): AwaitedResult<T, E2> =>
      awaited(promise.then(r => r.mapErr(func))),
    expect: (msg: string) => promise.then(r => r.expect(msg)),
    unwrap: () => promise.then(r => r.unwrap()),
    unwrapOr: <T2>(val: T2): Promise<T | T2> => promise.then(r => r.unwrapOr(val)),
  });
}
