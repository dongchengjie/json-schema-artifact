import { type JSONSchema, bundle, dereference } from "@apidevtools/json-schema-ref-parser";
import chokidar from "chokidar";
import { consola } from "consola";
import fs from "fs-extra";
import { localize } from "./locale";

export type BundleOptions = {
  input: string;
  output: string;
  locale?: string;
  minify: boolean;
  dereference?: "none" | "flatten" | "plain";
  watch?: string | string[];
};

export class Bundler {
  constructor(public options: BundleOptions) {}

  async bundle(watchMode: boolean) {
    return this.emit().then(() => {
      if (watchMode && this.options.watch) {
        consola.info(`👀 Watching for changes: ${this.options.watch}`);

        const watcher = chokidar.watch(this.options.watch, {
          ignoreInitial: true
        });
        watcher.on("change", async path => {
          if (path === this.options.output) return;

          consola.info(`🔄 File changed: ${path} (${Date.now()})`);

          try {
            await this.emit();
          } catch (error) {
            consola.error(error);
          }
        });
      }
    });
  }

  async transform() {
    let result = await bundle(this.options.input);

    // Dereference if needed
    if (this.options.dereference === "flatten") {
      result = flatten(result);
    } else if (this.options.dereference === "plain") {
      result = await dereference(result);
    }

    // Minify if needed
    const formatted = this.options.minify
      ? JSON.stringify(result)
      : JSON.stringify(result, null, 2);

    // Localize if needed
    const localized = this.options.locale ? localize(formatted, this.options.locale) : formatted;

    return localized;
  }

  async emit() {
    const result = await this.transform();
    if (result === undefined) return;

    fs.ensureFileSync(this.options.output);
    fs.writeFileSync(this.options.output, result, "utf-8");
  }
}

const flatten = (schema: JSONSchema) => {
  do {
    const json = JSON.stringify(schema);
    const refs = getReferences(json);
    const indirectRefs = refs
      .map(ref => getIndirectReferences(schema, ref))
      .filter(ref => ref !== undefined);

    if (indirectRefs.length === 0) break;

    // Replace indirect reference with it's actual target
    for (const ref of indirectRefs) {
      const flattened = json.replaceAll(ref.path, ref.target);
      schema = JSON.parse(flattened);
    }
  } while (true);

  return schema;
};

const getReferences = (json: string): string[] => {
  const regex = /"\$ref": "(.*)"/gm;
  const matches = json.matchAll(regex);
  const references = Array.from(matches, match => match[1]);
  return [...new Set(references)];
};

const getIndirectReferences = (root: any, ref?: string): Reference | undefined => {
  let path = "#";
  let current = root;
  let next: any;

  const nodes = ref?.replace("#/", "")?.split("/") ?? [];
  for (let node of nodes) {
    next = current[node];
    if (!next) return undefined;

    path = `${path}/${node}`;
    current = next;
    if (typeof next === "object" && next["$ref"]) {
      return Object.keys(next).length === 1
        ? {
            path: path,
            target: next["$ref"]
          }
        : undefined;
    }
  }
};

type Reference = {
  path: string;
  target: string;
};
