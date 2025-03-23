import { bench, run, summary } from "mitata";
import { Onion, type Layer } from "~/onion";

const toString: Layer<number, number, string, string> = (x, inner) => {
  const out = parseInt(inner(x.toString()));
  return out;
};

const toNumber: Layer<string, string, number, number> = (x, inner) => {
  const out = inner(parseInt(x)).toString();
  return out;
};

const a = Onion.shell<number, number>()
  .layer(toString)
  .layer(toNumber)
  .layer(toString)
  .layer(toNumber)
  .layer(toString)
  .layer(toNumber)
  .layer(toString)
  .layer(toNumber)
  .core((x) => x + 1);

console.log(a(1));

summary(() => {
  bench("base", () => a(1));
});

await run();
