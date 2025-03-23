import { Onion } from "./onion";
import type {
  Endpoint,
  ExtractParams,
  Fun,
  GareContext,
  GareOutput,
  HttpMethod,
  Layer,
  Params,
  Public,
} from "./types";

export function route<Path extends string>(path: Path) {
  return new Route<Path, Params<ExtractParams<Path>>, GareContext, GareOutput>(
    path,
    Onion.shell<any, GareOutput>()
  );
}

class Route<Path extends string, PublicX, X, Y> {
  constructor(
    private readonly path: Path,
    private readonly onion: Onion<any, GareOutput, PublicX & X, Y>
  ) {}

  route<SubPath extends string>(subPath: SubPath) {
    type NewPath = `${Path}${SubPath}`;

    return new Route<NewPath, PublicX & Params<ExtractParams<SubPath>>, X, Y>(
      (this.path + subPath) as NewPath,
      this.onion as any
    );
  }

  layer<InnerX, InnerY>(
    layer: Layer<PublicX & X, Y, InnerX, InnerY> & Public
  ): Route<Path, PublicX & InnerX, X, InnerY>;

  layer<InnerX, InnerY>(
    layer: Layer<PublicX & X, Y, InnerX, InnerY>
  ): Route<Path, PublicX, X & InnerX, InnerY>;

  layer(layer: any): any {
    return new Route(this.path, this.onion.layer(layer));
  }

  endpoint<Method extends HttpMethod, Z extends Y>(
    method: Method,
    handler: Fun<PublicX & X, Z>
  ): Endpoint<Method, Path, PublicX, Z> {
    return {
      path: this.path,
      method,
      call: this.onion.core(handler),
      public: handler as any,
    };
  }
}
