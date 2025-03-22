import type { Node } from "./types";

export type SearchResult<T> = {
  value?: T;
  params: Record<string, string>;
};

export function search<T>(
  node: Node<T>,
  target: string,
  targetOffset: number,
  prefixOffset: number,
  params: SearchResult<T>["params"]
): SearchResult<T> | undefined {
  const { prefix, param, greedy, value, children } = node;

  if (prefix.length > 10) {
    if (prefix !== target.slice(targetOffset, targetOffset + prefix.length)) {
      return;
    }
  } else {
    for (let i = prefixOffset; i < prefix.length; i++) {
      if (prefix.charCodeAt(i) !== target.charCodeAt(targetOffset + i)) {
        return;
      }
    }
  }

  const nextOffset = targetOffset + prefix.length;

  if (param !== undefined) {
    if (children) {
      for (let i = nextOffset; i < target.length; i++) {
        const nextNode = children[target[i]];
        if (nextNode) {
          const found = search(nextNode, target, i, 1, params);
          if (found) {
            if (param && i > nextOffset) {
              found.params[param] = target.slice(nextOffset, i);
            }
            return found;
          }
          if (!greedy) {
            return;
          }
        }
      }
    }

    if (param) {
      params[param] = target.slice(nextOffset);
    }

    return { value, params };
  }

  if (nextOffset === target.length) {
    return { value, params };
  }

  if (!children) {
    return;
  }

  const nextNode = children[target[nextOffset]];

  if (nextNode) {
    return search(nextNode, target, nextOffset, 1, params);
  }
}
