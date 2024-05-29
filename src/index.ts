#!/usr/bin/env node

import bundle from "./lib/bundle";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { Args } from "./lib/types";
import localize from "./lib/locale";

// command line args definition
const appName = "json-schema-artifact";
const args = yargs
  .usage(`Usage: ${appName} --config <config-file>`)
  .option("c", {
    alias: "config",
    type: "string",
    describe: `specify the location of the ${appName} file`,
    demandOption: false,
    default: `${appName}.json`,
  })
  .option("w", {
    alias: "watch",
    type: "boolean",
    describe: "watch for changes and regenerate artifacts",
    demandOption: false,
    default: false,
  })
  .detectLocale(false)
  .wrap(120).argv;

// run the app
(async () => {
  // retrieve config
  const configPath = path.resolve(args["config"]);
  if (!fs.existsSync(configPath)) {
    throw new Error(`${appName}.json file not found`);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Args;
  const watch = (args["watch"] as boolean) ?? false;

  // define operations on build
  const onBuild = async (verbose: boolean) => {
    for (let item of config.build.target) {
      // bundle JSON Schema
      await bundle(item.input, item.output, config.build.optimize, verbose);
      // localize JSON Schema
      const locales = { ...item.locale };
      for (let locale in locales) {
        localize(item.output, locale, locales[locale]);
      }
    }
  };

  // register watch changes if demanded
  if (watch && Array.isArray(config.watch) && config.watch.length > 0) {
    for (let item of config.watch) {
      if ("dir" in item) {
        fs.watch(item.dir, { recursive: item.recursive ?? true }, async (event, filename) => {
          if (event === "change") {
            try {
              const file = path.join(item.dir, filename);
              console.info(`🔄 Changes in file: ${file} at ${new Date().toISOString()}`);
              await onBuild(false);
            } catch (error) {
              console.error(error);
            }
          }
        });
        console.info(`👀 Watching changes ${item.recursive ? "recursively" : ""} in dir: ${item.dir}`);
      } else if ("file" in item) {
        fs.watch(item.file, async event => {
          if (event === "change") {
            try {
              const file = item.file;
              console.info(`🔄 Changes in file: ${file} at ${new Date().toISOString()}`);
              await onBuild(false);
            } catch (error) {
              console.error(error);
            }
          }
        });
        console.info(`👀 Watching changes in file: ${item.file}`);
      }
    }
  } else {
    await onBuild(true);
  }
})();
