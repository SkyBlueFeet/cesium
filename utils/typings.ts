/* eslint-disable @typescript-eslint/no-explicit-any */

export function typeConvert<T, K>(type: T): K {
  return type as any;
}
