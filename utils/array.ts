export function removeByIndex<T>(target: T[], index: number): T[] {
  if (index >= target.length || index < 0) return target;

  const _result: T[] = target
    .map((v, i, arr) => {
      if (i < index) return v;
      if (i === arr.length) return undefined;
      return arr[i + 1];
    })
    .filter(v => !!v);
  return _result;
}
