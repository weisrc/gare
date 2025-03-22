import { compress } from "./compress";
import { merge } from "./merge";
import { parse } from "./parse";
import { search } from "./search";

export function radix<T>(data: Record<string, T>) {
  const entires = Object.entries(data);
  const nodes = entires.map(([key, value]) => parse(key, value));
  const merged = merge(nodes);
  const compressed = compress(merged);

  return (target: string) => search(compressed, target, 0, 0, {});
}
