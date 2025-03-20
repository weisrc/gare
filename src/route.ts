import type {
  Endpoint,
  ExtractParams,
  Handler,
  HttpMethod,
  Params,
} from "./types";

export function route<Path extends string>(path: Path) {
  return new Route<Path, Params<ExtractParams<Path>>, {}>(path, []);
}

class Route<Path extends string, Input, Internal> {
  constructor(
    private readonly path: Path,
    private readonly middlewares: Handler<Input & Internal, unknown>[] = []
  ) {}

  sub<SubPath extends string>(subPath: SubPath) {
    type NewPath = `${Path}${SubPath}`;

    return new Route<NewPath, Input & Params<ExtractParams<SubPath>>, Internal>(
      (this.path + subPath) as NewPath,
      this.middlewares
    );
  }

  has<T>(middleware: Handler<Input & Internal, T>) {
    return new Route<Path, Input & T, Internal>(
      this.path,
      this.middlewares.concat(middleware)
    );
  }

  use<T>(middleware: Handler<Input & Internal, T>) {
    return new Route<Path, Input, Internal & T>(
      this.path,
      this.middlewares.concat(middleware)
    );
  }

  on<Method extends HttpMethod, Output>(
    method: Method,
    handler: Handler<Input & Internal, Output>
  ): Endpoint<Method, Path, Input, Output> {
    return {
      path: this.path,
      middlewares: this.middlewares,
      method,
      handler,
    };
  }

  get<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("GET", handler);
  }

  post<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("POST", handler);
  }

  put<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("PUT", handler);
  }

  delete<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("DELETE", handler);
  }

  patch<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("PATCH", handler);
  }

  head<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("HEAD", handler);
  }

  options<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("OPTIONS", handler);
  }

  connect<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("CONNECT", handler);
  }

  trace<Output>(handler: Handler<Input & Internal, Output>) {
    return this.on("TRACE", handler);
  }
}
