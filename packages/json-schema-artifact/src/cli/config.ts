import { consola } from "consola";
import { cosmiconfig } from "cosmiconfig";
import path from "node:path";
import { ArtifactConfig } from "../../types";
import { BundleOptions } from "./bundler";

export const loadConfig = async (config?: string): Promise<ArtifactConfig> => {
  // Attempt to load configuration from the specified path
  if (config) {
    const explorer = cosmiconfig("json-schema-artifact");
    try {
      const result = await explorer.load(path.resolve(config));
      if (result?.config) {
        consola.success(`Loaded configuration from ${result.filepath}`);
        return result.config;
      }
    } catch (error: any) {
      consola.error(`Error loading configuration from ${config}:`, error.message);
    }
  }

  // If no configuration specified or loading failed, search in default locations
  const extensions = [".json", ".yaml", ".yml", ".ts", ".mjs"];
  const searchPlaces = [...extensions.map(ext => `json-schema-artifact${ext}`)];

  const explorer = cosmiconfig("json-schema-artifact", { searchPlaces });
  const result = await explorer.search();

  if (result?.config) {
    consola.success(`Loaded configuration from ${result.filepath}`);
    return result.config;
  }

  // If no configuration found, throw an error
  throw new Error("No json-schema-artifact configuration files found.");
};

export const buildBundleOptions = (config: ArtifactConfig): BundleOptions[] => {
  const options = Array.isArray(config) ? config : [config];

  return options.flatMap(option => {
    const input = path.resolve(typeof option.input === "object" ? option.input.file : option.input);

    const { dir = "dist", file } = option.output;
    const output = file ? path.resolve(file) : path.resolve(dir, path.basename(input));

    const minify = option.output.optimize?.minify ?? false;
    const dereference = option.output.optimize?.dereference ?? "flatten";
    const watch = typeof option.watch === "boolean" ? input : option.watch;

    const result = { input, output, minify, dereference, watch };

    if (typeof option.input === "object" && option.input.locales && Object) {
      const locales = Object.entries(option.input.locales);
      if (locales.length > 0) {
        const list = locales.map(([code, paths]) => {
          const { dir, name, ext } = path.parse(output);
          const localized = path.join(dir, `${name}-${code}${ext}`);
          const locales = Array.isArray(paths)
            ? paths.map(p => path.resolve(p))
            : [path.resolve(paths)];
          return {
            ...result,
            output: localized,
            locales
          };
        });
        return [{ ...list[0], output }].concat(list);
      }
      return [result];
    }

    return [result];
  });
};
