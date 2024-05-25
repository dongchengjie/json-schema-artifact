# Installation

```
npm install --save-dev json-schema-artifact
```

# Usage

1. Create a file named `json-schema-artifact.json` in the workspace root.

- This configuration implies monitoring all files in the `src` directory and triggering a rebuild when changes occur. The build process utilizes `src/example.json` as input and produces `dist/example.json` as output.

- If you have any i18n (internationalization) requirements, you can configure the `locale` field to specify the language file to be used (in JSON format). Then define keys in the format of **t(\`key\`)** in source files.This will produce additional output files based on configured locales.

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
      "format": "minify",
      "refsDerefer": true
    }
  }
}
```

2. Start coding with `watch` on.

```bash
npx json-schema-artifact --watch
```

You can add the following configurations to the `.vscode/settings.json` file for validation and modifications.

```json
  "json.schemas": [
    {
      "url": "./dist/example.json",
      "fileMatch": ["test/example-test-data.json"]
    }
  ],
```

3. Bundle JSON Schema.

```bash
npx json-schema-artifact
```
