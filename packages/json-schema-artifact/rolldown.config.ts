import { defineConfig } from "rolldown";

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "esm"
    }
  },
  {
    input: "src/cli/index.ts",
    output: {
      file: "dist/cli.cjs",
      format: "cjs",
      inlineDynamicImports: true,
      minify: true
    }
  }
]);
