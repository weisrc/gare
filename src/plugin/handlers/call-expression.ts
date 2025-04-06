import type ts from "typescript";
import { getMarker, type TransformContext } from "../context";
import { handleIsMacro } from "./is-macro";

export function handleCallExpression(
  context: TransformContext,
  node: ts.CallExpression
) {
  const type = context.checker.getTypeAtLocation(node.expression);
  const marker = getMarker(context, type);

  switch (marker) {
    case '"is"':
      return handleIsMacro(context, node);
  }
}
