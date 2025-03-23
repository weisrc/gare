import type { Fun, Layer } from "./types";

export class Onion<ShellX, ShellY, X, Y> {
  constructor(private readonly shell: Layer<ShellX, ShellY, X, Y>) {}

  public layer<InnerX, InnerY>(
    f: Layer<X, Y, InnerX, InnerY>
  ): Onion<ShellX, ShellY, InnerX, InnerY> {
    return new Onion<ShellX, ShellY, InnerX, InnerY>((x, inner) =>
      this.shell(x, (y) => f(y, inner))
    );
  }

  public core(f: Fun<X, Y>): (x: ShellX) => ShellY {
    return (x) => this.shell(x, f);
  }

  public static shell<X, Y>(): Onion<X, Y, X, Y> {
    return new Onion<X, Y, X, Y>((x, inner) => inner(x));
  }
}
