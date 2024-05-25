"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const derefer_1 = __importDefault(require("./derefer"));
const format_1 = __importDefault(require("../format"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const buldle = async (input, output, optimize, verbose) => {
    println(`📦 Bundling file: ${input}`, verbose);
    await $RefParser.bundle(input).then(async (JSONSchema) => {
        // indirect refs dereference
        if (optimize.refsDerefer) {
            JSONSchema = await (0, derefer_1.default)(JSONSchema);
        }
        // minify or pretty format
        let schema;
        switch (optimize.format) {
            case "minify":
                schema = JSON.stringify(JSONSchema);
                break;
            case "pretty":
                schema = await (0, format_1.default)(JSON.stringify(JSONSchema), "json");
                break;
            default:
                schema = JSON.stringify(JSONSchema);
                break;
        }
        println(`💾 Saving to: ${output}`, verbose);
        // file output
        fs_extra_1.default.ensureFileSync(output);
        fs_extra_1.default.writeFileSync(output, schema);
    });
};
const println = (message, verbose) => {
    if (verbose)
        console.info(message);
};
exports.default = buldle;
