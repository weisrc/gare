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

export type ParserType<T> = T extends Parser<infer U> ? U : never;

export class Parser<T> {
  constructor(public run: (raw: string, offset: number) => ParserResult<T>) {}

  and<U>(other: Parser<U>) {
    return new Parser<[T, U]>((raw, offset) => {
      const aResult = this.run(raw, offset);
      if (!aResult.ok) return aResult;

      const bResult = other.run(raw, aResult.offset);
      if (!bResult.ok) return bResult;

      return parserOk([aResult.value, bResult.value], bResult.offset);
    });
  }

  then<U>(other: Parser<U>) {
    return this.and(other).second();
  }

  endsWith(other: Parser<unknown>) {
    return this.and(other).first();
  }

  first<U>(this: Parser<[U, unknown]>) {
    return this.map(([a]) => a);
  }

  second<U>(this: Parser<[unknown, U]>) {
    return this.map(([_, b]) => b);
  }

  or<U>(other: Parser<U>) {
    return new Parser<T | U>((raw, offset) => {
      const aResult = this.run(raw, offset);
      return aResult.ok ? aResult : other.run(raw, offset);
    });
  }

  mapAll<U>(f: (res: ParserResult<T>) => ParserResult<U>): Parser<U> {
    return new Parser((raw, offset) => {
      return f(this.run(raw, offset));
    });
  }

  map<U>(f: (t: T) => U): Parser<U> {
    return this.mapAll((res) => {
      return res.ok ? parserOk(f(res.value), res.offset) : res;
    });
  }

  value<U>(value: U): Parser<U> {
    return this.map(() => value);
  }

  mapError(f: (error: string) => string): Parser<T> {
    return this.mapAll((res) => {
      return res.ok ? res : parserError(f(res.error), res.offset);
    });
  }

  error(message: string): Parser<T> {
    return this.mapAll((res) => {
      return res.ok ? res : parserError(message, res.offset);
    });
  }

  repeated() {
    return new Parser((raw, offset) => {
      const result: T[] = [];
      let currentOffset = offset;

      while (true) {
        const next = this.run(raw, currentOffset);
        if (next.ok) {
          result.push(next.value);
          currentOffset = next.offset;
        } else {
          break;
        }
      }

      return parserOk(result, currentOffset);
    });
  }

  joined(this: Parser<string[]>): Parser<string> {
    return this.map((chars) => chars.join(""));
  }

  otherwise<U>(value: U): Parser<T | U> {
    return this.mapAll<T | U>((res) => {
      return res.ok ? res : parserOk(value, res.offset);
    });
  }

  static satisfy(predicate: (char: string) => boolean): Parser<string> {
    return new Parser((raw, offset) => {
      if (offset >= raw.length) {
        return parserError("unexpected end of input", offset);
      }
      const c = raw[offset];
      if (predicate(c)) {
        return parserOk(c, offset + 1);
      }
      return parserError(`unexpected '${c}'`, offset);
    });
  }

  static char(c: string): Parser<string> {
    return this.satisfy((x) => x === c);
  }

  static regex(re: RegExp): Parser<string> {
    return this.satisfy((c) => re.test(c));
  }

  static end: Parser<undefined> = new Parser((raw, offset) =>
    offset >= raw.length
      ? parserOk(undefined, offset)
      : parserError("expected end of input", offset)
  );
}

export function parserOk<T>(value: T, offset: number): ParserResult<T> {
  return { ok: true, value, offset };
}

export function parserError<T>(error: string, offset: number): ParserResult<T> {
  return { ok: false, error, offset };
}
