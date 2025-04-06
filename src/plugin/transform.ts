import type { PluginBuilder } from "bun";
import ts from "typescript";
import { handleCallExpression } from "./handlers/call-expression";
import type { TransformContext } from "./context";

export async function transform(
  program: ts.Program,
  build: PluginBuilder,
  filePath: string
): Promise<string> {
  const sourceFile = program.getSourceFile(filePath);

  if (!sourceFile) {
    throw new Error(`Could not find source file: ${filePath}`);
  }

  const context: TransformContext = {
    raw: sourceFile.getFullText(),
    checker: program.getTypeChecker(),
    build,
  };

  visitNode(context, sourceFile);

  return context.raw;
}

function visitNode(context: TransformContext, node: ts.Node) {
  if (ts.isCallExpression(node)) {
    handleCallExpression(context, node);
  }

  node.forEachChild((child) => visitNode(context, child));
}
