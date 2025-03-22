export type Node<T> = {
  prefix: string;
  param?: string;
  greedy?: boolean;
  value?: T;
  children?: Record<string, Node<T>>;
};
