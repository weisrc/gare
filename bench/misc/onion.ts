import { bench, run, summary } from "mitata";

type F<I, O> = (x: I) => O;
type Layer<I, O, X, Y> = (input: I, f: (x: X) => Y) => O;

type Builder<I, O, X, Y> = {
  run?: F<X, Y>;
  layer<LX, LY>(fn: Layer<X, Y, LX, LY>): Builder<I, O, LX, LY>;
  done(fn: F<X, Y>): F<I, O>;
};

function base<I, O>(): Builder<I, O, I, O> {
  return {
    layer<LX, LY>(layer: Layer<I, O, LX, LY>): Builder<I, O, LX, LY> {
      const next = rec<I, O, LX, LY>(this);
      this.run = (x: I) => layer(x, (y) => next.run!(y));
      return next;
    },
    done(fn: F<I, O>): F<I, O> {
      this.run = fn;
      return this.run;
    },
  };
}

function rec<I, O, X, Y>(base: Builder<I, O, I, O>): Builder<I, O, X, Y> {
  return {
    layer<LX, LY>(layer: Layer<X, Y, LX, LY>): Builder<I, O, LX, LY> {
      const next = rec<I, O, LX, LY>(base);
      this.run = (x: X) => layer(x, (y) => next.run!(y));
      return next;
    },
    done(fn: F<X, Y>): F<I, O> {
      this.run = fn;
      return base.run!;
    },
  };
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
