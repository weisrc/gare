import {
  Parser,
  parserError,
  parserOk,
  type ParserResult,
  type ParserType,
} from "../utils/parser";
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

const oldNode = urlChar
  .and(param)
  .map(([char, param]) => ({
    char,
    param,
  }))
  .or(
    urlChar
      .map((char) => ({ char, param: undefined }))
      .or(param.map((param) => ({ char: "", param })))
  );

type ParsedNode = ParserType<typeof oldNode>;

function nodeMapper<T>(
  value: T,
  parent: ParsedNode,
  child: Node<T> | undefined
): ParserResult<Node<T>> {
  const node: Node<T> = {
    prefix: parent.char,
    greedy: parent.param?.greedy,
    param: parent.param?.name,
    value: child ? undefined : value,
  };

  if (child) {
    if (!child.prefix) {
      return parserError("cannot have adjacent params", 0);
    }
    node.children = { [child.prefix]: child };
  }

  return parserOk(node, 0);
}

export function parse<T>(raw: string, value: T) {
  const tree: Parser<Node<T>> = new Parser((raw, i) => {
    const inner = oldNode
      .and(tree.or(Parser.end))
      .tryMap(([parent, child]) => nodeMapper(value, parent, child));
    return inner.run(raw, i);
  });

  const result = tree.run(raw, 0);

  if (!result.ok) {
    throw new Error(result.error + " at " + result.offset);
  }

  return result.value;
}
