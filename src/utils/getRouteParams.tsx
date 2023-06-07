import { Params } from "react-router";
import snakeToCamel from "./snakeToCamel";
export default function getRouteParams(
  params: Readonly<Params<string>>,
  keys: string[],
  defaultValues: string[]
): { [key: string]: string } {
  let result = {};
  for (let i = 0; i < keys.length; i++) {
    const newKey = snakeToCamel(keys[i]);
    result = { ...result, [newKey]: params[keys[i]] ? (params[keys[i]] as string) : defaultValues[i] };
  }
  return result;
}
