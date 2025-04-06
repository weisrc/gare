import ts from "typescript";
import type { TransformContext } from "../context";
import { augmentNode } from "../context";
import { typeCodegen } from "../type-codegen";

export function handleIsMacro(
  context: TransformContext,
  node: ts.CallExpression
) {
  const typeArg = node.typeArguments![0];
  const type = context.checker.getTypeAtLocation(typeArg);

  const codegen = typeCodegen(context, type, new Map());
  augmentNode(context, node, codegen);
}
