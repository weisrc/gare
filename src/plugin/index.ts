import { type BunPlugin, type OnLoadResult, plugin } from "bun";
import { createTsProgram } from "./create-ts-program";
import { transform } from "./transform";

export const garePlugin: BunPlugin = {
  name: "gare",
  async setup(build) {
    const program = createTsProgram();

    build.onLoad({ filter: /\.ts$/ }, async (args): Promise<OnLoadResult> => {
      const contents = await transform(program, build, args.path);
      return { contents };
    });
  },
};

plugin(garePlugin);
