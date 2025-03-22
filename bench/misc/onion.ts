import { bench, run, summary } from "mitata";

type F<X, Y> = (x: X) => Y;

type Layer<X, Y, InnerX, InnerY> = (input: X, inner: F<InnerX, InnerY>) => Y;

type Onion<ShellX, ShellY, X, Y> = {
  layer<InnerX, InnerY>(
    layer: Layer<X, Y, InnerX, InnerY>
  ): Onion<ShellX, ShellY, InnerX, InnerY>;
  done(core: F<X, Y>): F<ShellX, ShellY>;
};

function onion<ShellX, ShellY, X, Y>(
  shell: Layer<ShellX, ShellY, X, Y>
): Onion<ShellX, ShellY, X, Y> {
  return {
    layer<InnerX, InnerY>(layer: Layer<X, Y, InnerX, InnerY>) {
      return onion<ShellX, ShellY, InnerX, InnerY>((x, inner) =>
        shell(x, (y) => layer(y, inner))
      );
    },
    done(core: F<X, Y>): F<ShellX, ShellY> {
      return (x) => shell(x, core);
    },
  };
}

function base<X, Y>(): Onion<X, Y, X, Y> {
  return onion<X, Y, X, Y>((x, inner) => inner(x));
}

const toString: Layer<number, number, string, string> = (x, inner) => {
  const out = parseInt(inner(x.toString()));
  return out;
};
const toNumber: Layer<string, string, number, number> = (x, inner) => {
  const out = inner(parseInt(x)).toString();
  return out;
};

const a = base<number, number>()
  .layer(toString)
  .layer(toNumber)
  .layer(toString)
  .layer(toNumber)
  .layer(toString)
  .layer(toNumber)
  .layer(toString)
  .layer(toNumber)
  .done((x) => x + 1);

console.log(a(1));

summary(() => {
  bench("base", () => a(1));
});

await run();
