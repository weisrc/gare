import { bench, run, summary } from "mitata";

function switchLookup(x: string) {
  switch (x.charCodeAt(0)) {
    case 97:
      return { a: 1 };
    case 98:
      return { b: 2 };
    case 99:
      return { c: 3 };
    case 100:
      return { d: 4 };
    case 101:
      return { e: 5 };
    case 102:
      return { f: 6 };
    case 103:
      return { g: 7 };
    case 104:
      return { h: 8 };
    case 105:
      return { i: 9 };
    case 106:
      return { j: 10 };
    case 107:
      return { k: 11 };
    default:
      return { default: 0 };
  }
}

const map = {
  97: { a: 1 },
  98: { b: 2 },
  99: { c: 3 },
  100: { d: 4 },
  101: { e: 5 },
  102: { f: 6 },
  103: { g: 7 },
  104: { h: 8 },
  105: { i: 9 },
  106: { j: 10 },
  107: { k: 11 },
} as const;

function mapLookup(x: string) {
  return map[x.charCodeAt(0) as keyof typeof map] ?? { default: 0 };
}

const charMap = {
  a: { a: 1 },
  b: { b: 2 },
  c: { c: 3 },
  d: { d: 4 },
  e: { e: 5 },
  f: { f: 6 },
  g: { g: 7 },
  h: { h: 8 },
  i: { i: 9 },
  j: { j: 10 },
  k: { k: 11 },
} as const;

function charMapLookup(x: keyof typeof charMap) {
  return charMap[x] ?? { default: 0 };
}

summary(() => {
  bench("switchLookup", () => {
    switchLookup("j");
  });
  bench("mapLookup", () => {
    mapLookup("j");
  });
  bench("charMapLookup", () => {
    charMapLookup("j");
  });
});

await run();
