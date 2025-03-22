import { expect, test } from "bun:test";
import { parse } from "~/radix/parse";

test("no params", () => {
  expect(parse("api", 0)).toEqual({
    prefix: "a",
    greedy: undefined,
    param: undefined,
    value: undefined,
    children: {
      p: {
        greedy: undefined,
        param: undefined,
        value: undefined,
        prefix: "p",
        children: {
          i: {
            greedy: undefined,
            param: undefined,
            value: 0,
            prefix: "i",
          },
        },
      },
    },
  });
});

test("1 trailing param", () => {
  expect(parse("a/{b}", 0)).toEqual({
    prefix: "a",
    greedy: undefined,
    param: undefined,
    value: undefined,
    children: {
      "/": {
        prefix: "/",
        greedy: false,
        param: "b",
        value: 0,
      },
    },
  });
});

test("1 leading param", () => {
  expect(parse("{a}/b", 0)).toEqual({
    prefix: "",
    greedy: false,
    param: "a",
    value: undefined,
    children: {
      "/": {
        prefix: "/",
        greedy: undefined,
        param: undefined,
        value: undefined,
        children: {
          b: {
            prefix: "b",
            greedy: undefined,
            param: undefined,
            value: 0,
          },
        },
      },
    },
  });
});

test("1 middle param", () => {
  expect(parse("a/{b}/c", 0)).toEqual({
    prefix: "a",
    greedy: undefined,
    param: undefined,
    value: undefined,
    children: {
      "/": {
        prefix: "/",
        greedy: false,
        param: "b",
        value: undefined,
        children: {
          "/": {
            prefix: "/",
            greedy: undefined,
            param: undefined,
            value: undefined,
            children: {
              c: {
                prefix: "c",
                greedy: undefined,
                param: undefined,
                value: 0,
              },
            },
          },
        },
      },
    },
  });
});

test("param only", () => {
  expect(parse("{a}", 0)).toEqual({
    prefix: "",
    greedy: false,
    param: "a",
    value: 0,
  });
});

test("greedy param only", () => {
  expect(parse("{a*}", 0)).toEqual({
    prefix: "",
    greedy: true,
    param: "a",
    value: 0,
  });
});

test("throw adjacent params error", () => {
  expect(() => parse("{a}{b}", 0)).toThrow("cannot have adjacent params");
});

test("nameless param", () => {
  expect(parse("{}", 0)).toEqual({
    prefix: "",
    param: "",
    greedy: false,
    value: 0,
  });
});

test("greedy nameless param", () => {
  expect(parse("{*}", 0)).toEqual({
    prefix: "",
    param: "",
    greedy: true,
    value: 0,
  });
});
