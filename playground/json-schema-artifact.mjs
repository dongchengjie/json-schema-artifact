import { defineConfig } from "json-schema-artifact";

export default defineConfig([
  {
    input: {
      file: "src/example.json",
      locales: {
        zh_CN: "locales/zh_CN.yaml",
        en: "locales/en.yaml",
        ru: "locales/ru.yaml"
      }
    },
    output: {
      dir: "dist",
      optimize: {
        minify: true,
        dereference: "flatten"
      }
    },
    watch: ["src", "locales"]
  }
]);
