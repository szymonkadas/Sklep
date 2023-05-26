import { Params } from "react-router";
export default function getRouteParams(
  params: Readonly<Params<string>>,
  keys: string[],
  defaultValues: string[]
): { [key: string]: string } {
  let result = {};
  for (let i = 0; i < keys.length; i++) {
    result = { ...result, [keys[i]]: params[keys[i]] ? (params[keys[i]] as string) : defaultValues[i] };
  }
  return result;
}
