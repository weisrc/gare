export type TrieNode<T> = {
  param?: string;
  greedy?: boolean;
  value?: T;
  children?: Record<string, TrieNode<T>>;
};

export type RadixNode<T> = {
  prefix: string;
  param?: string;
  greedy?: boolean;
  value?: T;
  children?: Record<string, RadixNode<T>>;
};

export type LiteralSegment = {
  type: "literal";
  value: string;
};

export type ParamSegment = {
  type: "param";
  name: string;
};

export type Segment = LiteralSegment | ParamSegment;
