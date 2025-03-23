export type ExtractParams<T extends string> =
  T extends `${string}{${infer Param}*}${infer Rest}`
    ? [Param, ...ExtractParams<Rest>]
    : T extends `${string}{${infer Param}}${infer Rest}`
    ? [Param, ...ExtractParams<Rest>]
    : [];

export type Params<T extends string[]> = {
  params: {
    [k in T[number]]: string;
  };
};

export type GareContext = {
  req: Request;
};

export type GareOutput = Response;

export type Fun<X, Y> = (x: X) => Y;

export type Layer<X, Y, InnerX, InnerY> = (
  x: X,
  inner: Fun<InnerX, InnerY>
) => Y;

const PUBLIC = Symbol("public");

export type Public = {
  [PUBLIC]?: never;
};

export const METHODS = [
  "CONNECT",
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "POST",
  "PUT",
  "TRACE",
] as const;

export type HttpMethod = (typeof METHODS)[number];

export type Endpoint<
  Method extends HttpMethod = HttpMethod,
  Path extends string = string,
  Input = any,
  Output = any
> = {
  readonly path: Path;
  readonly method: Method;
  readonly call: Fun<GareContext, GareOutput>;
  readonly public: Fun<Input, Output>;
};
