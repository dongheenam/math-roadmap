// Fixes the issue with the includes method not working with string literals
// ref: https://github.com/microsoft/TypeScript/issues/26255
declare global {
  interface ReadonlyArray<T> {
    includes<S, R extends `${Extract<S, string>}`>(
      this: ReadonlyArray<R>,
      searchElement: S,
      fromIndex?: number
    ): searchElement is R & S;
  }
}

export {};
