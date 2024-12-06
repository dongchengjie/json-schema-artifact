#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const bundle_1 = __importDefault(require("./lib/bundle"));
const locale_1 = __importDefault(require("./lib/locale"));
// command line args definition
const appName = "json-schema-artifact";
const args = yargs_1.default
    .usage(`Usage: ${appName} --config <config-file>`)
    .option("c", {
    alias: "config",
    type: "string",
    describe: `specify the location of the ${appName} file`,
    demandOption: false,
    default: `${appName}.json`
})
    .option("w", {
    alias: "watch",
    type: "boolean",
    describe: "watch for changes and regenerate artifacts",
    demandOption: false,
    default: false
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
            // bundle JSON Schema
            await (0, bundle_1.default)(item.input, item.output, config.build.optimize, verbose);
            // localize JSON Schema
            const locales = { ...item.locale };
            for (let locale in locales) {
                (0, locale_1.default)(item.output, locale, locales[locale]);
            }
        }
    };
    // register watch changes if demanded
    if (watch && Array.isArray(config.watch) && config.watch.length > 0) {
        for (let item of config.watch) {
            if ("dir" in item) {
                fs_extra_1.default.watch(item.dir, { recursive: item.recursive ?? true }, async (event, filename) => {
                    if (event === "change") {
                        try {
                            const file = path_1.default.join(item.dir, filename);
                            console.info(`🔄 Changes in file: ${file} at ${new Date().toISOString()}`);
                            await onBuild(false);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                });
                console.info(`👀 Watching changes ${item.recursive ? "recursively" : ""} in dir: ${item.dir}`);
            }
            else if ("file" in item) {
                fs_extra_1.default.watch(item.file, async (event) => {
                    if (event === "change") {
                        try {
                            const file = item.file;
                            console.info(`🔄 Changes in file: ${file} at ${new Date().toISOString()}`);
                            await onBuild(false);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                });
                console.info(`👀 Watching changes in file: ${item.file}`);
            }
        }
    }
    else {
        await onBuild(true);
    }
})();
