import {
  type Parser,
  and,
  char,
  end,
  join,
  many,
  map,
  or,
  regex,
} from "../utils/parser";
import type { Node } from "./types";

const paramFirstChar = regex(/[a-zA-Z_]/);
const paramChar = regex(/[a-zA-Z0-9_]/);
const urlChar = regex(/[a-zA-Z0-9\-\._~/]/);
const star = char("*");
const openBrace = char("{");
const closeBrace = char("}");

const paramEnd = or(
  map(closeBrace, () => false),
  map(and(star, closeBrace), () => true)
);

const param = map(
  and(
    openBrace,
    or(
      and(join(and(paramFirstChar, join(many(paramChar)))), paramEnd),
      map(paramEnd, (param) => ["", param])
    )
  ),
  ([_, [name, greedy]]) => ({ name, greedy })
);

const node = or(
  map(and(urlChar, param), ([char, param]) => ({
    char,
    param,
  })),
  or(
    map(urlChar, (char) => ({ char, param: undefined })),
    map(param, (param) => ({ char: "", param }))
  )
);

export function parse<T>(raw: string, value: T) {
  const tree: Parser<Node<T>> = (raw, i) => {
    const inner = map(and(node, or(tree, end)), ([parent, child]) => {
      const out: Node<T> = {
        prefix: parent.char,
        greedy: parent.param?.greedy,
        param: parent.param?.name,
        value: child ? undefined : value,
      } as Node<T>;

      if (child) {
        if (!child.prefix) {
          throw new Error("cannot have adjacent params");
        }
        out.children = { [child.prefix]: child };
      }

      return out;
    });
    return inner(raw, i);
  };

  const result = tree(raw, 0);

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.value;
}
