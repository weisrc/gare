import type { PluginBuilder } from "bun";
import type ts from "typescript";
import { randomString, uniqueSymbol } from "./name-utils";

export type TransformContext = {
  raw: string;
  checker: ts.TypeChecker;
  build: PluginBuilder;
};

export function replaceNodeText(
  context: TransformContext,
  node: ts.Node,
  code: string
) {
  const start = node.getStart();
  const end = node.getEnd();
  context.raw = context.raw.slice(0, start) + code + context.raw.slice(end);
}

export function getMarker(context: TransformContext, type: ts.Type) {
  const property = type.getProperty("__gare");
  const propertyType = property && context.checker.getTypeOfSymbol(property);

  if (!propertyType) return;

  const typeString = context.checker.typeToString(propertyType);

  return typeString;
}

export function augmentNode(
  context: TransformContext,
  node: ts.Node,
  codegen: string
) {
  const id = uniqueSymbol(
    node.getText().length,
    node.getSourceFile(),
    context.checker
  );

  replaceNodeText(context, node, id);

  const moduleName = randomString(16);

  context.raw += `\nimport ${id} from "${moduleName}";`;

  context.build.module(moduleName, () => {
    return {
      contents: `const x = ${codegen};\nexport default x;`,
      loader: "js",
    };
  });
}
