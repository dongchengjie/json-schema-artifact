# Installation

```
npm install -g json-schema-artifact
```

# Usage

1. Create a file named `json-schema-artifact.json` in the workspace root. `watch` in the configuration is used for monitoring directory/file changes and rebundling. `build` is used for bundling your JSON Schema.

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
json-schema-artifact --watch
```

3. You can add the following configurations to the `.vscode/settings.json` file for validation and modifications.

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
json-schema-artifact
```
