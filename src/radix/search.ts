import type { RadixNode } from "./types";

type SearchResult<T> = {
  value?: T;
  params: Record<string, string>;
};

export function search<T>(
  node: RadixNode<T>,
  target: string,
  offset: number,
  params: SearchResult<T>["params"]
): SearchResult<T> | undefined {
  const { prefix, param: wildcard, greedy, value, children } = node;

  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== target[offset + i]) {
      return;
    }
  }

  const nextOffset = offset + prefix.length;

  if (wildcard !== undefined) {
    if (children) {
      for (let j = nextOffset; j < target.length; j++) {
        const nextNode = children[target[j]];
        if (nextNode) {
          const found = search(
            nextNode,
            target,
            j + 1,
            wildcard
              ? {
                  ...params,
                  [wildcard]: target.slice(nextOffset, j),
                }
              : params
          );
          if (found) {
            return found;
          }
          if (!greedy) {
            return;
          }
        }
      }
    }

    return {
      value,
      params: wildcard
        ? {
            ...params,
            [wildcard]: target.slice(nextOffset),
          }
        : params,
    };
  }

  if (nextOffset === target.length) {
    return { value, params };
  }

  if (!children) {
    return;
  }

  const nextNode = children[target[nextOffset]];

  if (nextNode) {
    return search(nextNode, target, nextOffset + 1, params);
  }
}
