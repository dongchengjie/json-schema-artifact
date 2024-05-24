#!/usr/bin/env node

import bundle from "./lib/bundle";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { Args } from "./lib/types";

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
      await bundle(item.input, item.output, config.build.optimize, verbose);
    }
  };

  // register watch changes if demanded
  if (watch && Array.isArray(config.watch) && config.watch.length > 0) {
    for (let item of config.watch) {
      if ("dir" in item) {
        fs.watch(item.dir, { recursive: item.recursive ?? true }, (event, filename) => {
          if (event === "change") {
            console.log(`📝 Changes in file: ${path.join(item.dir, filename)}`);
            onBuild(false);
          }
        });
      } else if ("file" in item) {
        fs.watch(item.file, event => {
          if (event === "change") {
            console.log(`📝 Changes in file: ${item.file}`);
            onBuild(false);
          }
        });
      }
    }
  } else {
    await onBuild(true);
  }
})();