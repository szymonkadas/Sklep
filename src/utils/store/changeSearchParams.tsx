export function changeSearchParams(searchParams: URLSearchParams, keys: string[], values: string[]) {
  for (let i = 0; i < keys.length; i++) {
    searchParams.set(keys[i], values[i]);
  }
}
