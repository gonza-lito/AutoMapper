export type Func<T> = T |(() => T | Func<T>);
