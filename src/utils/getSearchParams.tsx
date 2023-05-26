export default function getSearchParams(searchParams: URLSearchParams, params: string[]): { [key: string]: string } {
  let result = {};
  params.forEach(
    (param) => (result = { ...result, [param]: searchParams.get(param) ? (searchParams.get(param) as string) : "" })
  );
  return result;
}
