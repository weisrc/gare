import { bench, run, summary } from "mitata";

type Layer<T, U> = (x: T) => U;

type Builder<T, U> = {
  run: (x: T) => U;
  layer<V>(fn: Layer<U, V>): Builder<T, V>;
};

type IterBuilder<T, U> = Builder<T, U> & {
  layers: Layer<any, any>[];
};

function recBuilder<T, U>(run: Layer<T, U>): Builder<T, U> {
  return {
    run,
    layer<V>(fn: Layer<U, V>): Builder<T, V> {
      return recBuilder((x: T) => fn(run(x)));
    },
  };
}

function iterBuilder<T, U>(run: (x: T) => U): IterBuilder<T, U> {
  return {
    run(x) {
      let value: any = x;
      for (const layer of this.layers) {
        value = layer(value);
      }
      return value;
    },
    layers: [run],
    layer<V>(fn: Layer<U, V>): IterBuilder<T, V> {
      this.layers.push(fn);
      return this as unknown as IterBuilder<T, V>;
    },
  };
}

const toString: Layer<number, string> = (x: number) => x.toString();
const toNumber: Layer<string, number> = (x: string) => parseInt(x, 10);
const plusOne: Layer<number, number> = (x: number) => x + 1;
const double: Layer<number, number> = (x: number) => x * 2;

const a = recBuilder<number, number>((x) => x)
  .layer(toString)
  .layer(toNumber)
  .layer(plusOne)
  .layer(toString)
  .layer(toNumber)
  .layer(double)
  .layer(toString)
  .layer(toNumber)
  .layer(plusOne)
  .layer(toString)
  .layer(toNumber)
  .layer(double)
  .layer(toString);

const b = iterBuilder<number, number>((x) => x)
  .layer(toString)
  .layer(toNumber)
  .layer(plusOne)
  .layer(toString)
  .layer(toNumber)
  .layer(double)
  .layer(toString)
  .layer(toNumber)
  .layer(plusOne)
  .layer(toString)
  .layer(toNumber)
  .layer(double)
  .layer(toString);

console.log(a.run(123));
console.log(b.run(123));

summary(() => {
  bench("rec", () => a.run(123));
  bench("iter", () => b.run(123));
});

await run();
