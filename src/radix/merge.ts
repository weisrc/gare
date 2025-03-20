import type { TrieNode } from "./types";

export function merge<T>(alpha: TrieNode<T>, beta: TrieNode<T>): TrieNode<T> {
  if (alpha.param && beta.param) {
    if (alpha.param !== beta.param) {
      throw new Error("Param names do not match");
    }
    if (alpha.greedy !== beta.greedy) {
      throw new Error("Found conflicting param greediness");
    }
  }

  if (alpha.value && beta.value && alpha.value !== beta.value) {
    throw new Error("Found conflicting values");
  }

  const children: Record<string, TrieNode<T>> = {
    ...alpha.children,
    ...beta.children,
  };

  for (const key of Object.keys(children)) {
    children[key] = merge(
      alpha.children?.[key] ?? {},
      beta.children?.[key] ?? {}
    );
  }

  return {
    param: alpha.param ?? beta.param,
    greedy: alpha.greedy ?? beta.greedy,
    value: alpha.value ?? beta.value,
    children,
  };
}

export function mergeAll<T>(nodes: TrieNode<T>[]): TrieNode<T> {
  if (nodes.length === 1) {
    return nodes[0];
  }

  const mid = Math.floor(nodes.length / 2);
  const left = mergeAll(nodes.slice(0, mid));
  const right = mergeAll(nodes.slice(mid));

  return merge(left, right);
}
