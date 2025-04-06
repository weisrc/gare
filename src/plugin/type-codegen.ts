import type ts from "typescript";
import type { TransformContext } from "./context";
import { randomString } from "./name-utils";

type TypeMap = Map<ts.Type, { ref: string; recursive: boolean }>;

export function typeCodegen(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
): string {
  if (typeMap.has(type)) {
    const value = typeMap.get(type)!;
    value.recursive = true;
    return value.ref;
  }

  typeMap.set(type, { ref: randomString(16), recursive: false });

  const code = typeCodegenHelper(context, type, typeMap);

  const value = typeMap.get(type)!;
  return value.recursive ? `t.recursive((${value.ref}) => ${code})` : code;
}

const basic = [
  "string",
  "number",
  "boolean",
  "bigint",
  "symbol",
  "null",
  "undefined",
  "unknown",
  "any",
  "void",
  "object",
  "function",
];

function typeCodegenHelper(
  context: TransformContext,
  type: ts.Type,
  typeMap: TypeMap
) {
  const typeName = context.checker.typeToString(type);

  if (basic.includes(typeName)) {
    return `t.${typeName}`;
  }
  if (type.isLiteral()) {
    return `t.literal(${JSON.stringify(type.value)})`;
  }
  if (type.isUnion()) {
    const inner = type.types
      .map((t) => typeCodegen(context, t, typeMap))
      .join(", ");
    return `t.union(${inner})`;
  }
  if (type.isIntersection()) {
    const inner = type.types
      .map((t) => typeCodegen(context, t, typeMap))
      .join(", ");
    return `t.intersection(${inner})`;
  }

  if (context.checker.isArrayType(type)) {
    const [innerType] = context.checker.getTypeArguments(
      type as ts.TypeReference
    );
    return `t.array(${typeCodegen(context, innerType, typeMap)})`;
  }
  if (context.checker.isTupleType(type)) {
    const inner = context.checker
      .getTypeArguments(type as ts.TypeReference)
      .map((t) => typeCodegen(context, t, typeMap))
      .join(", ");
    return `t.tuple(${inner})`;
  }

  const constraint = type.getConstraint();

  console.log("Constraint", constraint);

  const properties = type.getProperties().map((prop) => {
    const propType = context.checker.getTypeOfSymbol(prop);
    return `${JSON.stringify(prop.name)}: ${typeCodegen(
      context,
      propType,
      typeMap
    )}`;
  });

  

  return `t.object({${properties.join(", ")}})`;
}
