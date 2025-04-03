import { assert } from "~/utils/assert";
import { Parser, type ParserType } from "../utils/parser";
import type { Node } from "./types";

const paramFirstChar = Parser.regex(/[a-zA-Z_]/);
const paramChar = Parser.regex(/[a-zA-Z0-9_]/);
const urlChar = Parser.regex(/[a-zA-Z0-9\-\._~/]/);
const star = Parser.char("*");
const openBrace = Parser.char("{");
const closeBrace = Parser.char("}");

const paramEnd = star.value(true).otherwise(false).endsWith(closeBrace);

const param = openBrace
  .then(
    paramFirstChar
      .and(paramChar.repeated().joined())
      .joined()
      .and(paramEnd)
      .or(paramEnd.map((param) => ["", param] as const))
  )
  .map(([name, greedy]) => ({ name, greedy }));

const firstNode = urlChar
  .otherwise("")
  .and(param.otherwise(undefined))
  .map(([char, param]) => ({
    char,
    param,
  }));

const node = urlChar
  .and(param.otherwise(undefined))
  .map(([char, param]) => ({ char, param }));

type ParsedNode = ParserType<typeof node>;

function intoNode<T>(
  value: T,
  parent: ParsedNode,
  child: Node<T> | undefined
): Node<T> {
  const node: Node<T> = {
    prefix: parent.char,
    greedy: parent.param?.greedy,
    param: parent.param?.name,
    value: child ? undefined : value,
  };

  if (child) {
    assert(child.prefix, "all nodes except root have a prefix");
    node.children = { [child.prefix]: child };
  }

  return node;
}

export function parse<T>(raw: string, value: T) {
  const tree: Parser<Node<T>> = new Parser((raw, i) => {
    const inner = node
      .and(Parser.end.or(tree))
      .map(([parent, child]) => intoNode(value, parent, child));
    return inner.run(raw, i);
  });

  const root = firstNode
    .and(Parser.end.or(tree))
    .map(([parent, child]) => intoNode(value, parent, child));

  const result = root.run(raw, 0);

  if (!result.ok) {
    const message =
      result.error +
      ": " +
      raw.slice(0, result.offset) +
      " HERE " +
      raw.slice(result.offset);

    throw new Error(message);
  }

  return result.value;
}
