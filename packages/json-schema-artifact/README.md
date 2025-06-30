# Installation

```bash
npm install --save-dev json-schema-artifact
```

# Usage

1. Create a configuration file `json-schema-artifact.mjs` (or `.json`, `.yaml`, `.yml`, `.ts`, `.mjs`) in your workspace root:

- ESM Format (Recommended):

```js
import { defineConfig } from "json-schema-artifact";

export default defineConfig([
  {
    input: {
      file: "src/example.json"
      // locales: {
      //   zh_CN: "locales/zh_CN.yaml",
      //   en: "locales/en.yaml",
      //   ru: "locales/ru.yaml"
      // }
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
```

- JSON Format:

```json
[
  {
    "input": {
      "file": "src/example.json"
      // "locales": {
      //   "zh_CN": "locales/zh_CN.yaml",
      //   "en": "locales/en.yaml",
      //   "ru": "locales/ru.yaml"
      // }
    },
    "output": {
      "dir": "dist",
      "optimize": {
        "minify": true,
        "dereference": "flatten"
      }
    },
    "watch": ["src", "locales"]
  }
]
```

- This configuration watches all files in `src` and `locales`, triggering rebuilds on changes.
- Localization configuration (optional):
  1. Configure locales with language files (JSON or YAML format).
  2. Use **t(\`key\`)** syntax (where `key` is a JSONPath expression that targets the corresponding value in locale files).

2. Start development with watch mode (use `--config` for custom config paths):

```bash
npx json-schema-artifact --watch
```

Add schema validation to `.vscode/settings.json`:

```json
{
  "json.schemas": [
    {
      "url": "./dist/example.json",
      "fileMatch": ["test/example-test-data.json"]
    }
  ]
}
```

3. Build JSON Schema artifacts:

```bash
npx json-schema-artifact
```

## Example

You can find an example [here](https://github.com/dongchengjie/json-schema-artifact/tree/main/playground).
