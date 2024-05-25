# Installation

```
npm install --save-dev json-schema-artifact
```

# Usage

1. Create a file named `json-schema-artifact.json` in the workspace root.

- This configuration implies monitoring all files in the `src` directory and triggering a rebuild when changes occur. The build process utilizes `src/example.json` as input and produces `dist/example.json` as output.

- If you have any internationalization (i18n) requirements, you can configure the locale field to specify the language file(in JSON format) to be used. In your source files, define keys in the format of **t(\`key\`)**. If the corresponding key is not found in the language file, the key itself will be used as a fallback. This process will generate additional output files based on the configured locales.

- You can find an example [here](https://github.com/dongchengjie/json-schema-artifact/tree/main/test).

```json
{
  "$schema": "node_modules/json-schema-artifact/schema/json-schema-artifact.json",
  "watch": [
    {
      "dir": "src",
      "recursive": true
    }
  ],
  "build": {
    "target": [
      {
        "input": "src/example.json",
        "output": "dist/example.json"
        // "locale": {
        //   "ru": "test/locales/ru.json",
        //   "fa": "test/locales/fa.json"
        // }
      }
    ],
    "optimize": {
      "format": "minify", // or pretty
      "refsDerefer": true
    }
  }
}
```

2. Start coding your JSON Schema with `watch` on.

```bash
npx json-schema-artifact --watch
```

You can include the following similar configurations in the `.vscode/settings.json` file for validation.

```json
  "json.schemas": [
    {
      "url": "./dist/example.json",
      "fileMatch": ["test/example-test-data.json"]
    }
  ],
```

3. Bundle JSON Schema and check the output.

```bash
npx json-schema-artifact
```
