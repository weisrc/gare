export type ExtractParams<T extends string> =
  T extends `${string}{${infer Param}*}${infer Rest}`
    ? [Param, ...ExtractParams<Rest>]
    : T extends `${string}{${infer Param}}${infer Rest}`
    ? [Param, ...ExtractParams<Rest>]
    : [];

export type Params<T extends string[]> = {
  [k in T[number]]: string;
};

export type Handler<Context = any, T = any> = (c: Context) => T | Promise<T>;

export type HttpMethod =
  | "CONNECT"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PUT"
  | "TRACE";

export type Endpoint<
  Method extends HttpMethod = HttpMethod,
  Path extends string = string,
  Input = any,
  Output = any
> = {
  readonly path: Path;
  readonly middlewares: Handler[];
  readonly method: Method;
  readonly handler: Handler;
};
