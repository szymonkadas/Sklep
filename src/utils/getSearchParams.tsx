import snakeToCamel from "./snakeToCamel";

export default function getSearchParams(searchParams: URLSearchParams, params: string[]): { [key: string]: string } {
  let result = {};
  params.forEach((param) => {
    return (result = {
      ...result,
      [snakeToCamel(param)]: searchParams.get(param) ? (searchParams.get(param) as string) : "",
    });
  });
  return result;
}
