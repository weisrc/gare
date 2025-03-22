import { bench, run, summary } from "mitata";

type F<I, O> = (x: I) => O;

type Layer<Input, Output, NextInput, NextOutput> = (
  input: Input,
  next: (x: NextInput) => NextOutput
) => Output;

type Onion<EndInput, EndOutput, Input, Output> = {
  layer<NextInput, NextOutput>(
    layer: Layer<Input, Output, NextInput, NextOutput>
  ): Onion<EndInput, EndOutput, NextInput, NextOutput>;
  done(fn: F<Input, Output>): F<EndInput, EndOutput>;
};

function onion<EndInput, EndOutput, Input, Output>(
  shell: Layer<EndInput, EndOutput, Input, Output>
): Onion<EndInput, EndOutput, Input, Output> {
  return {
    layer<NextInput, NextOutput>(
      layer: Layer<Input, Output, NextInput, NextOutput>
    ) {
      return onion<EndInput, EndOutput, NextInput, NextOutput>(
        (x, inner) => shell(x, (y) => layer(y, inner))
      );
    },
    done(fn: F<Input, Output>): F<EndInput, EndOutput> {
      return (x) => shell(x, fn);
    },
  };
}

function base<Input, Output>(): Onion<Input, Output, Input, Output> {
  return onion<Input, Output, Input, Output>((x, inner) => inner(x));
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
