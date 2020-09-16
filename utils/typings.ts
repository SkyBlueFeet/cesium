/* eslint-disable @typescript-eslint/no-explicit-any */

export function typeConvert<T = any, K = any>(type: T): K {
  return type as any;
}
