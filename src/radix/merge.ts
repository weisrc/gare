import { assert } from "~/utils/assert";
import type { Node } from "./types";

export function merge<T>(nodes: Node<T>[]): Node<T> {
  const [first, ...rest] = nodes;
  return rest.reduce((acc, node) => mergePair(acc, node), first);
}

function mergePair<T>(a: Node<T>, b: Node<T>): Node<T> {
  assert(
    a.prefix.length <= 1 && b.prefix.length <= 1,
    "prefix length at most 1"
  );

  if (a.prefix.length !== b.prefix.length) {
    const [one, zero] = a.prefix.length ? [a, b] : [b, a];
    return {
      ...zero,
      children: mergeChildren({ [one.prefix]: one }, zero.children),
    };
  }

  if (a.prefix !== b.prefix) {
    return {
      prefix: "",
      children: {
        [a.prefix]: a,
        [b.prefix]: b,
      },
    };
  }

  assert(
    !a.param || !b.param || a.param === b.param,
    "param names match if set"
  );
  assert(
    !a.param || !b.param || a.greedy === b.greedy,
    "param greediness match if set"
  );
  assert(!a.value || !b.value || a.value === b.value, "values match if set");

  return {
    prefix: a.prefix,
    param: a.param ?? b.param,
    greedy: a.greedy ?? b.greedy,
    value: a.value ?? b.value,
    children: mergeChildren(a.children, b.children),
  };
}

function mergeChildren<T>(
  a?: Record<string, Node<T>>,
  b?: Record<string, Node<T>>
): Record<string, Node<T>> {
  const children: Record<string, Node<T>> = {
    ...a,
    ...b,
  };

  for (const key in children) {
    children[key] = mergePair(
      a?.[key] ?? { prefix: key },
      b?.[key] ?? { prefix: key }
    );
  }

  return children;
}
