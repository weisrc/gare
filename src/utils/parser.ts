export type ParserResult<T> =
  | {
      ok: true;
      value: T;
      offset: number;
    }
  | {
      ok: false;
      error: string;
      offset: number;
    };

export type Parser<T> = (raw: string, offset: number) => ParserResult<T>;

export function ok<T>(value: T, offset: number): ParserResult<T> {
  return { ok: true, value, offset };
}

export function error<T>(error: string, offset: number): ParserResult<T> {
  return { ok: false, error, offset };
}

export function satisfy(predicate: (char: string) => boolean): Parser<string> {
  return (raw, offset) => {
    if (offset >= raw.length) {
      return error("unexpected end of input", offset);
    }
    const c = raw[offset];
    if (predicate(c)) {
      return ok(c, offset + 1);
    }
    return error(`unexpected '${c}'`, offset);
  };
}

export function char(c: string): Parser<string> {
  return satisfy((x) => x === c);
}

export function regex(re: RegExp): Parser<string> {
  return satisfy((c) => re.test(c));
}

export function or<T, U>(a: Parser<T>, b: Parser<U>): Parser<T | U> {
  return (raw, offset) => {
    const aResult = a(raw, offset);
    if (aResult.ok) return aResult;
    return b(raw, offset);
  };
}

export function and<T, U>(a: Parser<T>, b: Parser<U>): Parser<[T, U]> {
  return (raw, offset) => {
    const aResult = a(raw, offset);
    if (!aResult.ok) return aResult;

    const bResult = b(raw, aResult.offset);
    if (!bResult.ok) return bResult;

    return ok([aResult.value, bResult.value], bResult.offset);
  };
}

export function many<T>(parser: Parser<T>): Parser<T[]> {
  return (raw, offset) => {
    const result: T[] = [];
    let currentOffset = offset;

    while (true) {
      const next = parser(raw, currentOffset);
      if (next.ok) {
        result.push(next.value);
        currentOffset = next.offset;
      } else {
        break;
      }
    }

    return ok(result, currentOffset);
  };
}

export function join(parser: Parser<string[]>): Parser<string> {
  return map(parser, (chars) => chars.join(""));
}

export function map<T, U>(parser: Parser<T>, f: (t: T) => U): Parser<U> {
  return (raw, offset) => {
    const result = parser(raw, offset);
    if (result.ok) {
      return ok(f(result.value), result.offset);
    }
    return result;
  };
}

export function mapError<T>(
  parser: Parser<T>,
  f: (error: string) => string
): Parser<T> {
  return (raw, offset) => {
    const result = parser(raw, offset);
    if (result.ok) {
      return result;
    }
    return error(f(result.error), result.offset);
  };
}

export const end: Parser<undefined> = (raw, offset) =>
  offset >= raw.length
    ? ok(undefined, offset)
    : error("expected end of input", offset);
