#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bundle_1 = __importDefault(require("./lib/bundle"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
// command line args definition
const appName = "json-schema-artifact";
const args = yargs_1.default
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
    const configPath = path_1.default.resolve(args["config"]);
    if (!fs_extra_1.default.existsSync(configPath)) {
        throw new Error(`${appName}.json file not found`);
    }
    const config = JSON.parse(fs_extra_1.default.readFileSync(configPath, "utf-8"));
    const watch = args["watch"] ?? false;
    // define operations on build
    const onBuild = async (verbose) => {
        for (let item of config.build.target) {
            await (0, bundle_1.default)(item.input, item.output, config.build.optimize, verbose);
        }
    };
    // register watch changes if demanded
    if (watch && Array.isArray(config.watch) && config.watch.length > 0) {
        for (let item of config.watch) {
            if ("dir" in item) {
                fs_extra_1.default.watch(item.dir, { recursive: item.recursive ?? true }, (event, filename) => {
                    if (event === "change") {
                        console.log(`📝 Changes in file: ${path_1.default.join(item.dir, filename)}`);
                        onBuild(false);
                    }
                });
            }
            else if ("file" in item) {
                fs_extra_1.default.watch(item.file, event => {
                    if (event === "change") {
                        console.log(`📝 Changes in file: ${item.file}`);
                        onBuild(false);
                    }
                });
            }
        }
    }
    else {
        await onBuild(true);
    }
})();
