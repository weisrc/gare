import type { Node } from "./types";

export function compress<T>(node: Node<T>): Node<T> {
  if (!node.children) {
    return node;
  }

  const entries = Object.entries(node.children);

  if (entries.length === 1 && node.param === undefined && !node.value) {
    const child = compress(entries[0][1]);
    return {
      ...child,
      prefix: node.prefix + child.prefix,
    };
  }

  const children: Record<string, Node<T>> = {};

  for (const [key, child] of entries) {
    children[key] = compress(child);
  }

  return {
    ...node,
    children,
  };
}
