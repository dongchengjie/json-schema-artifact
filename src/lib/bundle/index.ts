import fs from "fs-extra";
import format from "../format";
import { Optimize } from "../types";
import derefer from "./derefer";

import $RefParser = require("@apidevtools/json-schema-ref-parser");

const buldle = async (input: string, output: string, optimize: Optimize, verbose: boolean) => {
  println(`📦 Bundling file: ${input}`, verbose);

  await $RefParser.bundle(input).then(async (JSONSchema: $RefParser.JSONSchema) => {
    // indirect refs dereference
    if (optimize.refsDerefer) {
      JSONSchema = await derefer(JSONSchema);
    }

    // minify or pretty format
    let schema: string;
    switch (optimize.format) {
      case "minify":
        schema = JSON.stringify(JSONSchema);
        break;
      case "pretty":
        schema = await format(JSON.stringify(JSONSchema));
        break;
      default:
        schema = JSON.stringify(JSONSchema);
        break;
    }

    println(`💾 Saving to: ${output}`, verbose);
    // file output
    fs.ensureFileSync(output);
    fs.writeFileSync(output, schema);
  });
};

const println = (message: string, verbose: boolean) => {
  if (verbose) console.info(message);
};

export default buldle;
