export interface LoaderParams {
  params: unknown;
  request: unknown;
}
interface LoaderData {}
export default interface LoaderFunction {
  (params: LoaderParams): Promise<LoaderData>;
}
