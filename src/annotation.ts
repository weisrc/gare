import type { Handler } from "./types";

export function annotate<T extends Handler>(handler: T, annotation: unknown) {
  Object.defineProperty(handler, "annotation", {
    value: annotation,
    writable: false,
  });
  return handler;
}

export function getAnnotation(handler: Handler) {
  if ("annotation" in handler) {
    return handler.annotation;
  }
}
