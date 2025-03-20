import type { TrieNode } from "./types";

export function parse<T>(path: string, value: T): TrieNode<T> {
  const root: TrieNode<T> = {};

  let node = root;
  let isInParam = false;
  let isAfterParam = false;

  for (const char of path) {
    switch (char) {
      case "{":
        if (isInParam) {
          throw new Error("Param is already opened");
        }

        if (isAfterParam) {
          throw new Error("Param is too close");
        }
        node.param = "";
        isInParam = true;
        break;
      case "}":
        if (!isInParam) {
          throw new Error("Param is not opened");
        }
        isInParam = false;
        isAfterParam = true;
        break;
      default:
        if (isInParam) {
          if (node.greedy) {
            throw new Error("* must be at the end of param");
          }

          if (char === "*") {
            if (node.param === "") {
              throw new Error("Param name must be provided");
            }
            node.greedy = true;
          } else {
            node.param += char;
          }
        } else {
          node.children = {};
          node.children[char] = {};
          node = node.children[char];
          isAfterParam = false;
        }
        break;
    }
  }

  node.value = value;

  if (isInParam) {
    throw new Error("Param is not closed");
  }

  return root;
}
