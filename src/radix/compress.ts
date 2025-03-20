import type { RadixNode, TrieNode } from "./types";

export function compress<T>(node: TrieNode<T>): RadixNode<T> {
  if (!node.children) {
    return {
      ...node,
      prefix: "",
      children: undefined,
    };
  }

  if (Object.keys(node.children).length === 1 && node.param === undefined && !node.value) {
    const key = Object.keys(node.children)[0];
    const child = compress(node.children[key]);

    return {
      ...child,
      prefix: key + child.prefix,
    };
  }

  const children: Record<string, RadixNode<T>> = {};

  for (const [key, child] of Object.entries(node.children)) {
    children[key] = compress(child);
  }

  return {
    ...node,
    prefix: "",
    children,
  };
}
